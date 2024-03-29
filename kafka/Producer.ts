import { Kafka, Producer as KafkaProducer, Message, CompressionTypes } from 'kafkajs'

const kafka = new Kafka({
    clientId: 'api',
    brokers: ["kafka1:9091"]
})


export default class Producer {
    private producer: KafkaProducer

    constructor() {
        this.producer = kafka.producer({
            allowAutoTopicCreation: true
        })
    }

    public async connect() {
        await this.producer.connect()
    }

    public async disconnect(){
        await this.producer.disconnect()
    }

    public async sendMessage(messages: Array<Message>, topic: string, compression?: CompressionTypes) {
        await this.producer.send({
          topic,
          messages,
          compression,
        })
    }
}