import cds from "@sap/cds";
import { Handler, Req, Func, Param } from "cds-routing-handlers";
import { CatalogService } from "../entities";

/**
 * Function handler.
 *
 * @export
 * @class FunctionHandler
 */
@Handler()
export class FunctionHandler {
    // The @Param decorator imports a url-parameter defined in your function definition
    // The @Req decorator import the current request object
    @Func(CatalogService.ActionSubmitOrder.name)
    public async submitOrder(
        @Param(CatalogService.ActionSubmitOrder.paramBook) bookId: CatalogService.IBook["ID"],
        @Param(CatalogService.ActionSubmitOrder.paramAmount) amount: number,
        @Req() req: any
    ): Promise<void> {
        const n = await cds
            .update(CatalogService.SanitizedEntity.Book)
            .with({ stock: { "-=": amount } })
            .where({ ID: bookId, stock: { ">=": amount } });
        n > 0 || req.error(409, `${amount} exceeds stock for book #${bookId}`);
    }
}
