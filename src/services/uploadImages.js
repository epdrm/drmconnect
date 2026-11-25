import { supabase } from "../supabase/supabase";

export async function envImagensStorage(nomeDobalde, arquivo) {
  // verifica se realmente foi passado um arquivo
  if (!arquivo) return null
  // cria e define um nome para o arquivo
  const fileName = `${Date.now()}-${arquivo.name}`
  // aqui ele vai chamar a função para acessar os bucktes do banco
  const { error } = await supabase.storage
    .from(nomeDobalde)
    .upload(fileName, arquivo)

  if (error) {
    console.error(error)
    return null
  }
  // se o envio der certo ele busca o Url e retorna pro usuário
  const { data: publicUrlData } = supabase.storage
    .from(nomeDobalde)
    .getPublicUrl(fileName)

  return publicUrlData.publicUrl
}