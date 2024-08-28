import fs from 'fs';
import { prepareWAMessageMedia, generateWAMessageFromContent, getDevice } from '@whiskeysockets/baileys';

const handler = async (m, {conn, args}) => {
  const datas = global
  const idioma = datas.db.data.users[m.sender].language
  const _translate = JSON.parse(fs.readFileSync(`./language/${idioma}.json`))
  const tradutor = _translate.plugins.gc_link

  let ppgc;
  try {
      ppgc = await conn.profilePictureUrl(m.chat, 'image')
  } catch {
      ppgc = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png'
  }  
  const ppgcbuff = await conn.getFile(ppgc)    
  const device = await getDevice(m.key.id);
    
    if (device !== 'desktop' || device !== 'web') {
        const linkcode = await conn.groupInviteCode(m.chat)
        var messa = await prepareWAMessageMedia({ image: ppgcbuff.data}, { upload: conn.waUploadToServer })
        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: 'https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat) },
                        footer: { text: `${global.wm}`.trim() },
                        header: {
                            hasMediaAttachment: true,
                            imageMessage: messa.imageMessage,
                        },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    // URL Redirect 
                                    name: 'cta_copy',
                                    buttonParamsJson: JSON.stringify({
                                        display_text: 'COPIAR LINK',
                                        copy_code: `https://chat.whatsapp.com/${linkcode}`,
                                        id: `https://chat.whatsapp.com/${linkcode}`
                                    })
                                },                   
                            ],
                            messageParamsJson: "",
                        },
                    },
                },
            }
        }, { userJid: conn.user.jid, quoted: m})
      conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id});
    } else {
        conn.reply(m.chat, 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group), m, {
           contextInfo: {externalAdReply: {mediaUrl: null, mediaType: 1, description: null,
           title: tradutor.texto1[0],
           body: '𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧',
           previewType: 0, thumbnail: fs.readFileSync('./Menu2.jpg'),
           sourceUrl: `https://whatsapp.com/channel/0029Val81KmBVJl22whkmi3i`}
           }
        }
      );  
   }
};
handler.help = ['linkgroup'];
handler.tags = ['group'];
handler.command = /^(link(gro?up)?)$/i;
handler.group = true;
handler.botAdmin = true;
export default handler;
