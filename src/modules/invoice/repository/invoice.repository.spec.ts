import { Sequelize } from "sequelize-typescript"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"
import { InvoiceModel } from "./invoice.model"
import { InvoiceItemsModel } from "./invoice-items.model"
import InvoiceItems from "../domain/invoice-items.entity"
import Invoice from "../domain/invoice.entity"
import InvoiceRepository from "./invoice.repository"

describe("Invoice Repository test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([InvoiceModel, InvoiceItemsModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create an invoice", async () => {
        const invoice = new Invoice({
            id: new Id("1"),
            name: "Lucian",
            document: "1234-5678",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Criciúma",
                "SC",
                "88888-888"
            ),
            items: [
                new InvoiceItems({
                    id: new Id("1"),
                    name: "Item 1",
                    price: 10
                }), 
                new InvoiceItems({
                    id: new Id("2"),
                    name: "Item 2",
                    price: 20
                })
            ]
        })

        const repository = new InvoiceRepository()
        await repository.generate(invoice)

        const invoiceDb = await InvoiceModel.findOne({ where: { id: "1" }, include: ["items"] })

        expect(invoiceDb).toBeDefined()
        expect(invoiceDb.id).toEqual(invoice.id.id)
        expect(invoiceDb.name).toEqual(invoice.name)
        expect(invoiceDb.document).toEqual(invoice.document)
        expect(invoiceDb.street).toEqual(invoice.address.street)
        expect(invoiceDb.number).toEqual(invoice.address.number)
        expect(invoiceDb.complement).toEqual(invoice.address.complement)
        expect(invoiceDb.city).toEqual(invoice.address.city)
        expect(invoiceDb.state).toEqual(invoice.address.state)
        expect(invoiceDb.zipCode).toEqual(invoice.address.zipCode)
        expect(invoiceDb.items.length).toEqual(2);
        expect(invoiceDb.items[0].id).toEqual(invoice.items[0].id.id)
        expect(invoiceDb.items[0].name).toEqual(invoice.items[0].name)
        expect(invoiceDb.items[0].price).toEqual(invoice.items[0].price)
        expect(invoiceDb.items[1].id).toEqual(invoice.items[1].id.id)
        expect(invoiceDb.items[1].name).toEqual(invoice.items[1].name)
        expect(invoiceDb.items[1].price).toEqual(invoice.items[1].price)
        expect(invoiceDb.createdAt).toStrictEqual(invoice.createdAt)
        expect(invoiceDb.updatedAt).toStrictEqual(invoice.updatedAt)
    })

    it("should find an invoice", async () => {
        const invoice = await InvoiceModel.create({
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
        })

        const repository = new InvoiceRepository()
        const result = await repository.find(invoice.id)

        expect(result.id.id).toEqual(invoice.id)
        expect(result.name).toEqual(invoice.name)
        expect(result.address.street).toEqual(invoice.street)
        expect(result.address.number).toEqual(invoice.number)
        expect(result.address.complement).toEqual(invoice.complement)
        expect(result.address.city).toEqual(invoice.city)
        expect(result.address.state).toEqual(invoice.state)
        expect(result.address.zipCode).toEqual(invoice.zipCode)
        expect(result.items.length).toEqual(2);
        expect(result.items[0].id.id).toEqual(invoice.items[0].id)
        expect(result.items[0].name).toEqual(invoice.items[0].name)
        expect(result.items[0].price).toEqual(invoice.items[0].price)
        expect(result.items[1].id.id).toEqual(invoice.items[1].id)
        expect(result.items[1].name).toEqual(invoice.items[1].name)
        expect(result.items[1].price).toEqual(invoice.items[1].price)
        expect(result.createdAt).toStrictEqual(invoice.createdAt)
        expect(result.updatedAt).toStrictEqual(invoice.updatedAt)
    })
})