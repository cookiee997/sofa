const {Client, MessageEmbed, Collection} = require('discord.js');
const client = new Client();
const fs = require('fs');
const config = require('./config.json');

client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});




client.on('ready', () => {
    client.user.setPresence({
        activity: {
            name: "music radio | inbox gửi confession"
        },
        status: 'online'
    })
    if (config.credit !== "Powered by Area 84"){
        console.log("Vui lòng không sửa Credit ! Bot bạn sẽ không hoạt động nếu sai Credit, xin cảm ơn");
        process.exit()
    }
    console.log(`${client.user.username} đã sẵn sàng!`);
});

client.on('message', (message) => {
    if (message.author.bot) return;


    const cfs_channel = client.channels.cache.get(config.cfsRoom);
    const user = client.users.cache.get('746095828975747083');

    if (message.content.length > 1024 && message.channel.type == 'dm'){
        message.react('❌');
        message.channel.send("Bạn đã gửi confession quá 1024 kí tự vui lòng bạn nhập lại.\nConfession chỉ được gửi tối đa 1024 kí tự");
        const embed = new MessageEmbed()
            .setDescription('Confession này không được thông qua ! Chỉ bạn thấy được báo cáo này')
            .setTitle("Confession sai quy định !")
            .addField(`ID: `, `${message.author.id}`)
            .setThumbnail(message.author.avatarURL())
            .setColor(0xff704d)
            .addField("UserName: ", `${message.author.tag}`)
            .addField("User Tag:", `<@!${message.author.id}>`);
        user.send(embed);

    } else if (message.content.length < 1024 && message.channel.type == 'dm'){
        message.react('🌾');
        message.channel.send("<:keo:744593211246248046> |**__Cảm ơn bạn gửi confession__** <a:A84_TraiTimDap:707343556452417556>, Tâm sự của bạn sẽ xuất hiện ở <#707016802957262919> ");
        let count = JSON.parse(fs.readFileSync('./count.json')).count
        count++
        const embed = new MessageEmbed()
            .setDescription(`${message.content}`)
            .setThumbnail(config.imgCfs)
            .addField(`<a:A84_YeuYeu:762684903883538432> **Lời tâm sự số:** \`${count}\`` , `Nhắn tin cho mình để gửi tâm sự của bạn...`)
            .setColor("0xff1a1a")
            .setTitle(config.titleCfs)
            .setTimestamp()
            .setFooter(config.credit);
        cfs_channel.send(embed);

        const embedNoti = new MessageEmbed()
            .setTitle("CONFESSION LOGGIN")
            .setDescription(`**Nội dung :**\n${message.content}\n**Confession số:** \`${count}\``)
            .setColor(0x99ff99)
            .setThumbnail(message.author.avatarURL())
            .addField(`ID: `, message.author.id)
            .addField("UserName: ", `${message.author.tag}`)
            .addField("User Tag:", `<@!${message.author.id}>`);
        user.send(embedNoti);

        var count_json = {
            "count": count
        }
        fs.writeFileSync('./count.json', JSON.stringify(count_json));
    }

});

client.on('message', async message => {
    if (message.author.bot) return;

    const prefix = config.prefix;

    const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command){
        command.run(client, message, args)
    };
});




client.login(config.token);