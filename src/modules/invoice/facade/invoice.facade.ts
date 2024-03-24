import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export interface UseCaseProps {
    generateUseCase: GenerateInvoiceUseCase;
    findUseCase: FindInvoiceUseCase;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
    private _generateUseCase: GenerateInvoiceUseCase;
    private _findUseCase: FindInvoiceUseCase;

    constructor(useCaseProps: UseCaseProps) {
        this._generateUseCase = useCaseProps.generateUseCase;
        this._findUseCase = useCaseProps.findUseCase;
    }

    async generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
        return await this._generateUseCase.execute(input);
    }

    async find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
        return await this._findUseCase.execute(input);
    }
}