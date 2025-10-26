import { api } from "./api";
import { router } from "@inertiajs/react";

const normalizeRoute = (route) => {
    if (!route) {
        throw new Error("Route definition is required");
    }

    if (typeof route === "string") {
        return { url: route, method: "get" };
    }

    if (typeof route === "object" && route.url) {
        const method = route.method ?? route.methods?.[0] ?? "get";
        return { url: route.url, method: method.toLowerCase() };
    }

    throw new Error("Unsupported route definition provided to wayfinder helper");
};

export const send = (route, payload, config = {}) => {
    const { url, method } = normalizeRoute(route);
    const requestConfig = {
        url,
        method,
        ...config,
    };

    if (typeof payload !== "undefined") {
        requestConfig.data = payload;
    }

    return api.request(requestConfig);
};

export const submit = (route, options = {}) => {
    const { data, method, ...rest } = options;
    const normalized = normalizeRoute(route);

    return router.visit(normalized.url, {
        method: method ?? normalized.method,
        data,
        ...rest,
    });
};

export const resolveUrl = (route) => normalizeRoute(route).url;

export const resolveMethod = (route) => normalizeRoute(route).method;
