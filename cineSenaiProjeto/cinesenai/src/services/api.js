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
    },

    filmes:{
        Listar:() => request("/api/filmes"),

        buscarPorid:(id)=> request(`/api/filmes/${id}`),

        criar:(filme)=> request("/api/filmes",{
            method:"POST",
            body:JSON.stringify(filme)

        }),

        atualizar:(filme,id)=> request(`/api/filmes/${id}`,{
            method:"PUT",
            body:JSON.stringify(filme),

        }),

        deletar:(id)=> request(`/api/filmes/${id}`,{
            method:"DELETE",
        }),

    },
    
    avaliacoes:{
        Listar:(filmeId)=> request(`/api/filmes/${filmeId}/avaliacoes`),

        criar : (filmeId,avaliacao)=>request(`/api/filmes/${filmeId}/avaliacoes`,{

            method :"POST",
            body:JSON.stringify(avaliacao),
        }),
            
    },

    admin :{
        ListarReservas :() => request(`/api/admin/reservas`),

        gerarRelatorio: ()=>request(`/api/admin/relatorios`),

        promoverUsuario:(id)=> request(`/api/admin/usuarios${id}/promover`,{
            method :"PACHT"
        }),
    },

    favoritos: {
        listar: (filmeId)=> request(`/api/filmes/${filmeId}/favoritos`),// TODO


        adicionar:(filme)=> request(`/api/filmes/${filme}/favoritos`,{
            method:"POST",
            body:JSON.stringify(filme)
            }), // TODO

        
        remover: (id)=> request(`/api/filmes/${id}/favoritos`,{
            method:"DELETE",
        }),  // TODO

        verificar: (filmeId)=> request(`api/favoritos/verificar?filmeId=${filmeId}`,{
         
            }),// verifica se um filme específico já está nos favoritos
    },

}
