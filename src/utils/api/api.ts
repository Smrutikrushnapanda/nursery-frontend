import axios from "axios";

const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

export const api = axios.create({
    baseURL: backend,
    headers: {
        "Content-Type": "application/json",
    },
});


//get all the sidebar menus
export const masterApis = {
    getMenu : async()=>{
    try {

        const {data} = await api.get("/master/menus");

        return data;

    } catch (error: any) {
        console.log(error.message);
    }
}
}