import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import InvoiceItems from "../../domain/invoice-items.entity"
import Invoice from "../../domain/invoice.entity"
import FindInvoiceUseCase from "./find-invoice.usecase"

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
        "88888-888",
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

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice))
    }
}

describe("Find Invoice use case unit test", () => {

    it("should find an invoice", async () => {

        const repository = MockRepository()
        const usecase = new FindInvoiceUseCase(repository)

        const input = { id: "1" }
        const result = await usecase.execute(input)

        expect(repository.find).toHaveBeenCalled()
        expect(result.id).toEqual(input.id)
        expect(result.name).toEqual(invoice.name)
        expect(result.address).toEqual(invoice.address)
        expect(result.items.length).toEqual(2);
        expect(result.items[0].id).toEqual(invoice.items[0].id.id)
        expect(result.items[0].name).toEqual(invoice.items[0].name)
        expect(result.items[0].price).toEqual(invoice.items[0].price)
        expect(result.items[1].id).toEqual(invoice.items[1].id.id)
        expect(result.items[1].name).toEqual(invoice.items[1].name)
        expect(result.items[1].price).toEqual(invoice.items[1].price)
        expect(result.total).toEqual(invoice.total())
        expect(result.createdAt).toStrictEqual(invoice.createdAt)
    })
})