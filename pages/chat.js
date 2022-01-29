import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import supabaseConfig from '../supabase_config.json';

// Como fazer AJAX: https://medium.com/@omariosouto/entendendo-como-fazer-ajax-com-a-fetchapi-977ff20da3c6
const supabaseClient = createClient(supabaseConfig.URL, supabaseConfig.ANON_KEY);


export default function ChatPage() {

    const [message, setMessage] = React.useState('');
    const [messageList, setMessageList] = React.useState([]);


    React.useEffect(() => {

        supabaseClient
            .from('message_list')
            .select('*')
            // .then((resp) => {
            //     console.log('Dados da consulta: ', resp);
            //     setMessageList(resp.data);
            .order('created_at', { ascending: false })
            .then(({ data }) => {
                console.log('SELECT - Dados da consulta: ', data);
                setMessageList(data);
            });

    }, []);


    function submitNewMessage(newMessage) {

        const message = {
            // id: messageList.length + 1,
            // created_at: new Date(),
            from: 'ViniciusBSilva',
            text: newMessage,
            image: 'https://github.com/ViniciusBSilva.png',
        };

        supabaseClient
            .from('message_list')
            .insert([message,])          // tem que ser um objeto com os MESMOS campos
            .then(({ data }) => {
                console.log('INSERT - Dados da resposta: ', data);
                setMessageList([data[0], ...messageList]);
            });

        // setMessageList([message, ...messageList]);
        setMessage('');

    }

    function deleteMessage(id) {

        // Lista original
        console.log("Lista original: ");
        console.log(messageList);

        // Cria nova lista sem o item
        // // Filter() é executado para cada item do array. 
        // // Quando a callback retorna "false" o item não é adicionado ao novo array
        const newMessageList = messageList.filter((item) => {
            return item.id != id;
        });

        // Nova lista sem o item
        console.log("Nova lista: ");
        console.log(newMessageList);

        // Atualiza a lista
        setMessageList(newMessageList);
    }


    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    {/* 
                            Passar as funções como parâmetro!!!
                    */}

                    <MessageList
                        messages={messageList}
                        deleteMessage={deleteMessage}
                    />

                    <Box
                        as="form"
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitNewMessage(message);
                        }}
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={(event) => {
                                const value = event.target.value;
                                setMessage(value)
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    submitNewMessage(message);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <Button
                            type='submit'
                            label='Enviar'
                            // fullWidth
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {

    // console.log(props);

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >

            {props.messages.map((message) => {
                return (

                    <Text
                        key={message.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                                <Box styleSheet={{ width: '100%', display: 'flex' }}>
                                    <Image
                                        styleSheet={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            display: 'inline-block',
                                            marginRight: '8px',
                                        }}
                                        src={message.image}
                                    />
                                    <Text tag="strong"
                                        styleSheet={{
                                            fontSize: '14px',
                                            marginLeft: '8px',
                                        }}
                                    >
                                        {message.from}
                                    </Text>
                                    <Text
                                        styleSheet={{
                                            fontSize: '14px',
                                            marginLeft: '8px',
                                            color: appConfig.theme.colors.neutrals[300],
                                        }}
                                        tag="span"
                                    >
                                        {(new Date(message.created_at).toLocaleDateString())}
                                    </Text>
                                </Box>
                                <Button
                                    iconName="FaRegWindowClose"
                                    onClick={() => {
                                        props.deleteMessage(message.id);
                                    }}
                                    colorVariant="neutral"
                                    variant="tertiary"
                                />
                            </Box>
                        </Box>
                        {message.text}
                    </Text>

                );

            })}
        </Box>
    )
}