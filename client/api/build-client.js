import axios from "axios";

const buildClient = ({ req }) => {
    if (typeof window === "undefined") {
        //we are on server.
        // now req should be made to the http://my-service.my-namespace.svc.cluster.local
        // ingress-nginx-controller.ingress-nginx.svc.cluster.local
        // http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser
        return axios.create({
            baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
            headers: req.headers
        });
    } else {
        // we are on the browser: now req can be made with a base url
        return axios.create({
            baseURL: "/"
        });
    }
}

export default buildClient;