import {Request, Response} from "express";
import PromocodesModel from "../REST-entities/promocodes/promocodes.model";

export const createPromo = async (req: Request, res: Response) => {
    const {amount, discount, type,from,to} = req.body;
    const voucher_codes = require('voucher-code-generator');
    let codes = []
    try {
        codes = voucher_codes.generate({
            count: amount,
            length: 8,
            charset: voucher_codes.charset("alphanumeric")
        });
    } catch (e) {
        console.log("Sorry, not possible. " + e);
    }
    // const date = new Date().toUTCString()
    const data_start = from;
    const data_stop = to;
    // console.log(d);
    const new_promos = codes.map((code: string) => {
        return {
            discount: discount,
            isUsing: null,
            promo: code,
            type: type,
            period: {
                from: data_start,
                to: data_stop
            }
        }
    });
    await PromocodesModel.insertMany(new_promos);

    const promo = await PromocodesModel.find({});
    return res.status(200).send(promo);
}
export const getPromo = async (req: Request, res: Response) => {
    let promo: any = [];
    if (req.query?.promo) {
        const query = {promo: req.query["promo"].toString()};
        promo = await PromocodesModel.find(query);
    } else {
        promo = {
            personal: await PromocodesModel.find({type: "Personal"}),
            common: await PromocodesModel.find({type: "Common"})
        }
    }
    return res.status(200).send(promo);
}
export const switchPromoStatus = async (req: Request, res: Response) => {
    if (req.query?.promo) {
        const query = {promo: req.query["promo"].toString()};
        await PromocodesModel.updateOne(query, {isUsing: true});
        return res.status(200).send("switchPromoStatus");
    }
    return res.status(404).send("err");
}
export const deletePromo = async (req: Request, res: Response) => {
    if (req.query?.promo) {
        const query = {promo: req.query["promo"].toString()};
        await PromocodesModel.deleteOne(query);
        return res.status(200).send("deletePromo");
    } else {
        return res.status(404).send("err");
    }
}