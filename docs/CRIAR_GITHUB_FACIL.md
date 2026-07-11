# 🚀 Como Criar Conta GitHub em 5 Minutos

## ✅ Passo 1: Acessar GitHub

1. Abra: **https://github.com/signup**
2. Clique em "Sign up"

## ✅ Passo 2: Preencher Dados

Você vai ver um formulário com:

```
Email:           seu@email.com (use: espacoauad@gmail.com)
Password:        Escolha uma senha forte
                 (ex: Wanessa123456!)
Username:        Escolha um nome de usuário
                 (ex: wanessa-auad, wanessa-mwa, etc)
```

### 📌 Dicas para Username
- Use seu nome (ex: `wanessa-auad`)
- Sem espaços (use hífen -)
- Minúsculas
- Pode conter números

**Exemplo sugerido**: `wanessa-mwa`

## ✅ Passo 3: Confirmar Email

1. Depois de preencher, GitHub envia email
2. Abra seu email (espacoauad@gmail.com)
3. Clique no link de confirmação
4. Pronto! Conta criada

## ✅ Passo 4: Configurar SSH (Opcional, mas Recomendado)

Se quer fazer push sem digitar senha toda vez:

```bash
# Gere chave SSH
ssh-keygen -t ed25519 -C "espacoauad@gmail.com"

# Quando pedir passphrase, deixe em branco e aperte Enter 2x
# Vai criar arquivo em: C:\Users\wanes\.ssh\id_ed25519.pub
```

Depois:
1. Abra arquivo: `C:\Users\wanes\.ssh\id_ed25519.pub`
2. Copie todo conteúdo
3. Vá para: https://github.com/settings/keys
4. Clique "New SSH key"
5. Cole o conteúdo
6. Clique "Add SSH key"

## ✅ Pronto!

Quando tiver a conta criada, me manda o username que faço o push!

**Exemplo**: Se criar com username `wanessa-mwa`, você me fala e faço:
```bash
git remote add origin https://github.com/wanessa-mwa/MWA.git
git push -u origin main
```

---

**Tempo estimado: 5 minutos** ⏱️

Quando estiver pronto, manda uma mensagem! 🚀
