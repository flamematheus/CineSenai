const BASE_URL = "";

const getAuthHeaders =()=>{

    const token = localStorage.getItem("token");

    return token
        ? {"Autorization":`Bearer ${token}`}
        : {};
};

const  request = async (url,options = {})=>{

    const headers = {
        
        "content-type ":"appLication/json",
        ...getAuthHeaders(),

        ...options.headers,
    };

    const response = await fetch(
        url,
        { ...options,
        headers,}
    );
    if (response.status === 204) {
        return null
    
    }
    if (response.status === 401 || response.status === 403) {
        if (localStorage.getItem("token")) {

            localStorage.removeItem("token");

            localStorage.removeItem("user");

            window.dispatchEvent(
                new Event("auth-change")
            );
        
        }

    }

    if (!response.ok) {

        const errorData = await response.json()
        .catch(()=>({}));

        throw new Error( 
                errorData.message || `Erro na requisição(Status:${response.status})`
        );
    }
    return response.json();
    

} 

export const api = {
    auth:{
        login:(email,senha)=>
            request("/api/auth/login",{
                method:"POST",
                body:JSON.stringify({email,senha}),
            }),

        cadastro:(nome,email,senha)=>
            request ("/api/auth/cadastro",{
                method:"POST",
                body:JSON.stringify({nome ,email,senha}),
            }),
    }
}
