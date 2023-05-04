import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async (props = {}) => {
        try {
            setErrors(null);

            const response = await axios[method](url, { ...body, ...props });

            if (onSuccess) {
                // console.log(response.data)
                console.log("reaching 1")
                onSuccess(response.data);
                console.log("reaching 2")
            }

            return response.data;
        } catch (err) {
            console.log("caught an error")
            if (err.response && err.response.data && err.response.data.errors) {
                setErrors(
                    <div className="alert alert-danger">
                        <h4>Oops..</h4>
                        <ul className="my-0">
                            {err.response.data.errors.map((err) => (
                                <li key={err.message}>{err.message}</li>
                            ))}
                        </ul>
                    </div>
                )
            } else {
                setErrors(
                    <div className="alert alert-danger">
                        <h4>Oops..</h4>
                        <p>Something went wrong. Please try again later.</p>
                    </div>
                );
            }
        }
    }
    return { doRequest, errors }
};

export default useRequest;