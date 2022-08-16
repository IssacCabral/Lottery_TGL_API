
function randomNumber(): number {
    return Math.floor(Math.random() * 9)
}

export default function generateCpf() {
    let cpf = ''

    for (let i = 0; i < 11; i++) {
        cpf += randomNumber()
    }

    const token = Array.from(cpf)
    
    token.splice(3, 0, ".")
    token.splice(7, 0, ".")
    token.splice(11, 0, '-')

    return token.join('')
}