import express = require("express");
import Mailer from "./mailer";
import {JSON_RESPONSES} from "./consts";

const {ADMIN_TOKEN} = process.env;

export const apiLocationHandler = (req: express.Request, res: express.Response) => {
    const {latitude: lat, longitude: lng, street, recipient} = req.body;
    const {authorization} = req.headers;

    const token = authorization.split(/\s/gm).pop();

    if (token !== ADMIN_TOKEN) {
        res.status(403).send({
            result: JSON_RESPONSES.ERROR,
            message: "Not authorized"
        });

        return;
    }

    if (!recipient) {
        res.status(422).send({
            result: JSON_RESPONSES.ERROR,
            message: "Recipient must be specified"
        });

        return;
    }

    Mailer.getInstance().sendMail({
        from: `Settler Tech Admin <admin@settler.tech>`,
        to: recipient,
        subject: "Phone Location",
        html: `Latitude: ${lat}<br/>Longitude: ${lng}<br/><br/>Address: ${street}`
    });

    res.send({
        result: JSON_RESPONSES.SUCCESS,
        message: "Mail sent"
    });
}
