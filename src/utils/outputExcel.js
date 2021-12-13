import {resolve} from "url";

/**
 *
 * TANGiMING
 * 2019-3-5
 * @param {Array} headers
 * @param {Array} data
 * @param {String} filename
 */
export default function (headers, data = [], filename = "excel1") {
    return new Promise((resolve, reject) => {
        import("@/utils/Export2Excel").then(excel => {
            const tHeader = headers;
            excel.export_json_to_excel({
                header: tHeader,
                data,
                filename
            });
            resolve();
        });
    })
}
