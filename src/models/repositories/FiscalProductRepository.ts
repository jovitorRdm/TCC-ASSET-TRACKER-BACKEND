import { AppError, ErrorMessages } from "../../infra/http/errors";
import { prismaClient } from "../../infra/prisma";
import { FiscalProduct } from "../domains";
import {
  CreateFiscalProductDTO,
  FiscalProductDTO,
  UpdateFiscalProductDTO,
} from "../dtos/fiscalProduct";
import { excludeFields, parseArrayOfData } from "../../helpers/utils";
import { FindAllArgs } from "../../interfaces";
import { ProductEntriesDTO } from "../dtos";

export class FiscalProductRepository {
  async create({
    invoiceNumber,
    issueDate,
    productEntries,
    totalAmount,
    supplierId,
  }: CreateFiscalProductDTO) {
    const existingFiscalProduct = await prismaClient.fiscalProduct.findFirst({
      where: {
        invoiceNumber,
      },
    });

    if (existingFiscalProduct) {
      throw new AppError(ErrorMessages.MSGE02);
    }

    const fiscalProduct = new FiscalProduct(
      supplierId,
      invoiceNumber,
      issueDate,
      totalAmount,
      productEntries
    );

    fiscalProduct.validate();

    const createdFiscalProduct = await prismaClient.fiscalProduct.create({
      data: {
        invoiceNumber: fiscalProduct.invoiceNumber,
        issueDate: fiscalProduct.issueDate,
        totalAmount: fiscalProduct.totalAmount,
        productEntries: {
          createMany: {
            data: fiscalProduct.productEntries.map((product) => ({
              productId: product.productId,
              quantity: product.quantity,
              value: product.value,
            })),
          },
        },

        supplier: {
          connect: { id: fiscalProduct.supplierId },
        },
      },
      include: {
        supplier: true,
        productEntries: {
          select: {
            id: true,
            quantity: true,
            value: true,
          },
        },
      },
    });

    for (const product of productEntries) {
      if (
        typeof product === "object" &&
        product?.productId &&
        product?.quantity &&
        product?.value
      ) {
        const existingProduct = await prismaClient.product.findUnique({
          where: { id: product.productId },
        });

        if (existingProduct == null) {
          throw new AppError(ErrorMessages.MSGE05);
        }

        if (existingProduct) {
          console.log(existingProduct);

          const newQuantity = existingProduct.quantity + product.quantity;
          const newValue = existingProduct.value + product.value;

          await prismaClient.product.update({
            where: { id: product.productId },
            data: {
              quantity: newQuantity,
              value: newValue,
            },
          });
        }
      }
    }

    return excludeFields(createdFiscalProduct, ["createdAt", "updatedAt"]);
  }

  async update(id: string, data: UpdateFiscalProductDTO) {
    try {
      const fiscalProductToUpdate =
        await prismaClient.fiscalProduct.findUniqueOrThrow({
          where: { id },
          include: {
            supplier: true,
            productEntries: {
              select: {
                id: true,
                quantity: true,
                value: true,
              },
            },
          },
        });

      const fiscalProduct = new FiscalProduct(
        fiscalProductToUpdate.supplierId,
        fiscalProductToUpdate.invoiceNumber,
        fiscalProductToUpdate.issueDate.toISOString(),
        fiscalProductToUpdate.totalAmount,
        fiscalProductToUpdate.productEntries as ProductEntriesDTO[]
      );

      if (data.supplierId !== undefined)
        fiscalProduct.supplierId = data.supplierId;
      if (data.invoiceNumber !== undefined)
        fiscalProduct.invoiceNumber = data.invoiceNumber;
      if (data.issueDate !== undefined)
        fiscalProduct.issueDate = data.issueDate;
      if (data.totalAmount !== undefined)
        fiscalProduct.totalAmount = data.totalAmount;
      if (data.productEntries !== undefined)
        fiscalProduct.productEntries = data.productEntries;
      if (data.status !== undefined) fiscalProduct.status = data.status;

      fiscalProduct.validate();

      const fiscalProductToDelete = fiscalProductToUpdate.productEntries.filter(
        (product) =>
          !fiscalProduct.productEntries.some(
            (productToUpdate) => product.id === productToUpdate.id
          )
      );

      if (fiscalProductToDelete.length > 0) {
        await prismaClient.productEntry.deleteMany({
          where: {
            id: {
              in: fiscalProductToDelete.map((product) => product.id),
            },
          },
        });
      }

      if (fiscalProduct.invoiceNumber !== fiscalProductToUpdate.invoiceNumber) {
        const existingFiscalProduct =
          await prismaClient.fiscalProduct.findFirst({
            where: {
              invoiceNumber: fiscalProduct.invoiceNumber,
              NOT: {
                id: id,
              },
            },
          });

        if (existingFiscalProduct) {
          throw new AppError(ErrorMessages.MSGE02);
        }
      }

      const productEntriesToCreate = fiscalProduct.productEntries.filter(
        (product) => !product.id
      );

      const productEntriesToUpdate = fiscalProduct.productEntries.filter(
        (product) => {
          const productToUpdate = fiscalProductToUpdate.productEntries.find(
            (productToUpdate) => productToUpdate.id === product.id
          );

          return JSON.stringify(product) !== JSON.stringify(productToUpdate);
        }
      );

      const updatedFiscalProduct = await prismaClient.fiscalProduct.update({
        where: { id },
        data: {
          invoiceNumber: fiscalProduct.invoiceNumber,
          issueDate: fiscalProduct.issueDate,
          totalAmount: fiscalProduct.totalAmount,
          productEntries: {
            createMany: {
              data: productEntriesToCreate.map((product) => ({
                productId: product.productId,
                quantity: product.quantity,
                value: product.value,
              })),
            },
            updateMany: productEntriesToUpdate.map((product) => ({
              where: { id: product.id },
              data: {
                productId: product.productId,
                quantity: product.quantity,
                value: product.value,
              },
            })),
          },
          supplier: {
            connect: {
              id: fiscalProduct.supplierId,
            },
          },
          status: fiscalProduct.status,
        },
        include: {
          supplier: true,
          productEntries: {
            select: {
              id: true,
              quantity: true,
              value: true,
            },
          },
        },
      });

      for (const product of data.productEntries) {
        if (
          typeof product === "object" &&
          product?.productId &&
          product?.quantity &&
          product?.value
        ) {
          const existingProduct = await prismaClient.product.findUnique({
            where: { id: product.productId },
          });

          if (existingProduct == null) {
            throw new AppError(ErrorMessages.MSGE05);
          }

          if (existingProduct) {
            console.log(existingProduct);

            const newQuantity = existingProduct.quantity + product.quantity;
            const newValue = existingProduct.value + product.value;

            await prismaClient.product.update({
              where: { id: product.productId },
              data: {
                quantity: newQuantity,
                value: newValue,
              },
            });
          }
        }
      }

      return excludeFields(updatedFiscalProduct, ["createdAt", "updatedAt"]);
    } catch (e) {
      if (e instanceof AppError) throw e;

      throw new AppError(ErrorMessages.MSGE03, 404);
    }
  }

  async findAll(args: FindAllArgs) {
    const where = {
      OR: args.searchTerm
        ? [
            {
              invoiceNumber: {
                contains: args?.searchTerm,
              },
            },
          ]
        : undefined,
      status: {
        equals: args?.filterByStatus,
      },
    };

    const totalItems = await prismaClient.fiscalProduct.count({
      where,
    });

    const data = await prismaClient.fiscalProduct.findMany({
      where,
      include: {
        supplier: {
          select: {
            person: true,
          },
        },
        productEntries: {
          select: {
            id: true,
            quantity: true,
            value: true,
            productId: true,
            Product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
      skip: args?.skip,
      take: args?.take,
    });

    return {
      data: parseArrayOfData(
        data.map((item) => ({
          ...item,
          supplier: item.supplier.person,
          productEntries: item.productEntries.map((product) => ({
            ...product,
            name: product.Product.name,
          })),
        })),
        ["createdAt", "updatedAt"]
      ),
      totalItems,
    };
  }

  async findById(id: string) {
    const fiscalProduct = await prismaClient.fiscalProduct.findUnique({
      where: { id },
    });

    if (!fiscalProduct) {
      throw new Error(ErrorMessages.MSGE05);
    }

    const dataToReturn = {
      ...excludeFields(
        {
          ...fiscalProduct,
        },
        ["createdAt", "updatedAt"]
      ),
    };

    return dataToReturn;
  }
}
