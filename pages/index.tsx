/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AluraCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'

const TOKEN = '20bdc200470d537286ea4281b283d1'
const PROD_URL = 'https://alurakut-nine-murex.vercel.app'
interface User {
  githubUser: string
}

interface Comunidade {
  title: string
  imageUrl: string
}

function ProfileSidebar(user: User) {  
  return (
    <Box as="aside">          
      <img src={`https://github.com/${user.githubUser}.png`}
        alt="profile"
        style={{borderRadius: '8px'}}
      />
      <p>
        <a className="boxLink" href={`https://github.com/${user.githubUser}`}>
          @{user.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />

    </Box>
  )
}

function ProfileRealationBox(props: any) {
  return (
    <ProfileRelationsBoxWrapper>
    <h2 className="smallTitle">
        {props.title} ({props.items.length})
    </h2>
    <ul>            
          {props.items.map((item: any, index: number) => {
            return (                                      
              index <= 5 && <li key={item.id}>
                <a href={`https://github.com/${item.login}.png`}>
                  <img 
                    src={item.avatar_url}
                    alt="oi"                          
                  />
                  <span>{item.login}</span>
                </a>
              </li>
            )
          })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}



const Home = (props: any) => {
  
  const githubUser = props.githubUser
  
  const [seguidores, setSeguidores] = useState([])
  const [comunidades, setComunidades] = useState<Comunidade[]>([])
  
  
  const pessoasFavoritas = [
    'juunegreiros',
    'daniielsantos',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
  ]

  var urls = [];  
  for(var i = 0; i <= 10; i++) {
      urls.push(i);
  }

  
  useEffect(() => {
    
    fetch('https://api.github.com/users/peas/followers')
    .then((chunk) => {
        return chunk.json()
    })
    .then((result) => {
      setSeguidores(result)
    })
    // API GaphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        query: `{ allCommunities { 
          title
          id
          imageUrl
          creatorSlug
        }}`
      })
    })
    .then((res) => res.json())
    .then((response) => {
      const comunidadesDato = response.data.allCommunities
      setComunidades(comunidadesDato)
    })
  },[])

  return (
    <>
      <AlurakutMenu githubUser={githubUser}/>
      <MainGrid>
        <div className="profileArea" style={{gridArea: 'profileArea'}}> 
          <ProfileSidebar githubUser={githubUser}/>
        </div>
        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
          <Box>
            <h1 className="title">
              Bem vindo(a) {githubUser}
            </h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer ?</h2>
            <form onSubmit={function handlerCriarComunidade(e) {
              e.preventDefault()
              const dadosDoForm = new FormData(e.currentTarget)
              const comunidade = {                
                title: dadosDoForm.get('title') as string,
                imageUrl: dadosDoForm.get('image') as string,
                creatorSlug: githubUser
              }
              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (res) => {
                const dados = await res.json()
                const comunidade = dados.registroCriado
                setComunidades([...comunidades,comunidade])              
              })
            }}>
              <div>
                <input 
                  placeholder="Qual vai ser o nome da usa comunidade?" 
                  name="title" 
                  aria-label="Qual vai ser o nome da usa comunidade?"
                  type="text"
                />
              </div>
              
              <div>                
                <input key={new Date().toISOString()} type="hidden" name="image" value={`https://picsum.photos/300/300?${new Date().toISOString()}`}/>
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
          <Box>
            <h1 className="subTitle">Mandar mensagem para amigo</h1>
            <form onSubmit={(e) => {
              e.preventDefault()
              const dadosForm = new FormData(e.currentTarget)
              const mensagem = {
                name: githubUser,
                message: dadosForm.get('mensagem'),
                user: dadosForm.get('users'),
                sent_date: new Date().toISOString()
              }
              fetch('/api/mensagens', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(mensagem)
              })
              .then(async (res) => {
                const dados = await res.json()
                if (res.status === 200){
                  alert(`Mensagem enviada com sucesso para: ${dados.data.user}`)
                }
              })
              .catch(error => console.log('deu ruim ', error))
            }}>
              {/* <input type="text" name="nome" placeholder="Digite seu nome" required/> */}
              <input type="text" name="mensagem" placeholder="Digite uma mensagem" required/>
              Para: <select name="users" key='9128'>
              {pessoasFavoritas.map((item, index) => {
                return (
                  <option value={item} key={new Date().toISOString()+index}>{item}</option>
                  )
                })}
                </select>
                
                <br/>
                <br/>
              <button>Enviar</button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>          
        <ProfileRealationBox title={"Seguidores"} items={seguidores}/>
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
              Comunidades ({comunidades.length})
          </h2>
          <ul>            
                {comunidades.map((item: Comunidade, index: number) => {
                  return (                                      
                    index <= 5 && <li key={item.imageUrl}>
                      <a href={`/communities/${item.title}`}>
                        <img 
                          src={item.imageUrl}
                          alt="oi"                          
                        />
                        <span>{item.title}</span>
                      </a>
                    </li>
                  )
                })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>
            <ul>
              {pessoasFavoritas.map((item, index) => {
                return (         
                  index <= 5 && <li key={item}>                           
                    <a href={`https://github.com/${item}`}>
                      <img 
                        src={`https://github.com/${item}.png`}
                        alt="oi"
                        style={{borderRadius: '8px'}}
                      />
                      <span>{item}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}


export async function getServerSideProps(context: any) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN

  const { isAuthenticated }  = await fetch('http://localhost:3000/api/auth', {
    headers: {
      Authorization: token
    }
  })
  .then((response)=> response.json())

  if (!isAuthenticated) {
    
    nookies.destroy(context,'USER_TOKEN')
    
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  // https://alurakut-nine-murex.vercel.app/

  const  user: any = jwt.decode(token)  
  const { githubUser } = user

  return {
    props: {
      githubUser: githubUser
    }
  }
}
export default Home