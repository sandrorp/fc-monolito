import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice.model";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceRepository from "../repository/invoice.repository";
import InvoiceFacade from "./invoice.facade";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import { InvoiceItemsModel } from "../repository/invoice-items.model";
import Address from "../../@shared/domain/value-object/address";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe("Invoice Facade Test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        await sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should generate an invoice", async () => {
        const repository = new InvoiceRepository();
        const generateUseCase = new GenerateInvoiceUseCase(repository);
        const facade = new InvoiceFacade({
            generateUseCase: generateUseCase,
            findUseCase: undefined
        });

        const input = {
            id: "1",
            name: "Lucian",
            document: "1234-5678",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "88888-888",
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    price: 10,
                },
                {
                    id: "2",
                    name: "Item 2",
                    price: 20,
                },
            ]
        }

        const result = await facade.generate(input);

        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.document).toEqual(input.document);
        expect(result.street).toEqual(input.street);
        expect(result.number).toEqual(input.number);
        expect(result.complement).toEqual(input.complement);
        expect(result.city).toEqual(input.city);
        expect(result.state).toEqual(input.state);
        expect(result.zipCode).toEqual(input.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toBeDefined();
        expect(result.items[0].name).toEqual(input.items[0].name);
        expect(result.items[0].price).toEqual(input.items[0].price);
        expect(result.items[1].id).toBeDefined();
        expect(result.items[1].name).toEqual(input.items[1].name);
        expect(result.items[1].price).toEqual(input.items[1].price);
        expect(result.total).toBe(30);
    });

    it("should find an invoice", async () => {
        const repository = new InvoiceRepository();
        const generateUseCase = new GenerateInvoiceUseCase(repository);
        const findUseCase = new FindInvoiceUseCase(repository);
        const facade = new InvoiceFacade({
            generateUseCase: generateUseCase,
            findUseCase: findUseCase
        });

        const invoice = await InvoiceModel.create(
            {
                id: "1",
                name: "Lucian",
                document: "1234-5678",
                street: "Rua 123",
                number: "99",
                complement: "Casa Verde",
                city: "Criciúma",
                state: "SC",
                zipCode: "88888-888",
                items: [
                    {
                        id: "1",
                        name: "Item 1",
                        price: 10,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: "2",
                        name: "Item 2",
                        price: 20,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                include: [{ model: InvoiceItemsModel }]
            }
        );

        const result = await facade.find({ id: "1" });

        expect(result.id).toBeDefined();
        expect(result.id).toBe(invoice.id);
        expect(result.name).toBe(invoice.name);
        expect(result.document).toBe(invoice.document);
        expect(result.address.street).toBe(invoice.street);
        expect(result.address.number).toBe(invoice.number);
        expect(result.address.complement).toBe(invoice.complement);
        expect(result.address.city).toBe(invoice.city);
        expect(result.address.state).toBe(invoice.state);
        expect(result.address.zipCode).toBe(invoice.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toBeDefined();
        expect(result.items[0].name).toEqual(invoice.items[0].name);
        expect(result.items[0].price).toEqual(invoice.items[0].price);
        expect(result.items[1].id).toBeDefined();
        expect(result.items[1].name).toEqual(invoice.items[1].name);
        expect(result.items[1].price).toEqual(invoice.items[1].price);
        expect(result.total).toBe(30);
    })

    it("should generate an invoice using factory", async () => {
        const facade = InvoiceFacadeFactory.create();

        const input = {
            id: "1",
            name: "Lucian",
            document: "1234-5678",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "88888-888",
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    price: 10,
                },
                {
                    id: "2",
                    name: "Item 2",
                    price: 20,
                },
            ]
        }

        const result = await facade.generate(input);

        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.document).toEqual(input.document);
        expect(result.street).toEqual(input.street);
        expect(result.number).toEqual(input.number);
        expect(result.complement).toEqual(input.complement);
        expect(result.city).toEqual(input.city);
        expect(result.state).toEqual(input.state);
        expect(result.zipCode).toEqual(input.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toBeDefined();
        expect(result.items[0].name).toEqual(input.items[0].name);
        expect(result.items[0].price).toEqual(input.items[0].price);
        expect(result.items[1].id).toBeDefined();
        expect(result.items[1].name).toEqual(input.items[1].name);
        expect(result.items[1].price).toEqual(input.items[1].price);
        expect(result.items.length).toBe(2);
        expect(result.total).toBe(30);
    });

    it("should find an invoice using factory", async () => {
        const invoice = await InvoiceModel.create(
            {
                id: "1",
                name: "Lucian",
                document: "1234-5678",
                street: "Rua 123",
                number: "99",
                complement: "Casa Verde",
                city: "Criciúma",
                state: "SC",
                zipCode: "88888-888",
                items: [
                    {
                        id: "1",
                        name: "Item 1",
                        price: 10,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: "2",
                        name: "Item 2",
                        price: 20,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                include: [{ model: InvoiceItemsModel }]
            }
        );

        const facade = InvoiceFacadeFactory.create();
        const result = await facade.find({ id: "1"});

        expect(result.id).toBeDefined();
        expect(result.name).toEqual(invoice.name);
        expect(result.document).toEqual(invoice.document);
        expect(result.address.street).toEqual(invoice.street);
        expect(result.address.number).toEqual(invoice.number);
        expect(result.address.complement).toEqual(invoice.complement);
        expect(result.address.city).toEqual(invoice.city);
        expect(result.address.state).toEqual(invoice.state);
        expect(result.address.zipCode).toEqual(invoice.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toEqual(invoice.items[0].id);
        expect(result.items[0].name).toEqual(invoice.items[0].name);
        expect(result.items[0].price).toEqual(invoice.items[0].price);
        expect(result.items[1].id).toEqual(invoice.items[1].id);
        expect(result.items[1].name).toEqual(invoice.items[1].name);
        expect(result.items[1].price).toEqual(invoice.items[1].price);
        expect(result.total).toBe(30);
    });
});