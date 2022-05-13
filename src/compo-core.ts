import { log } from "./utils.js";
import category from "./category.js";
import { datas } from "./storage.js";
import queues from "./run-queue.js";

const compo = {
    _: new Map(),
    sto: null,

    reg: (name: string, info: string, data: any, pre: Function, func: Function, styl: string): Function => {
        const sn = category.alias("component") + name;
        info = info.replaceAll(" ", "_");
        datas[sn] = {
            ty: "object",
            lvs: {
                on: { ty: "boolean", dft: true },
                ...data,
            },
        };
        compo._.set(name, { info, pre, styl });
        return (...args) => func(...((data ? [{ msto: compo.sto[sn] }] : []).concat(args)));
    },
};

queues.onload.push(() => {
    for (const [nm, co] of compo._.entries()) {
        if (co.styl) GM_addStyle(co.styl);
        log(`Preparing component: ${nm}`);
        if (co.pre) co.pre({ msto: compo.sto[category.alias("component") + nm] });
    }
});

export default compo;
