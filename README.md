# Discord integration for ucollection

[@UCollection](https://github.com/Ivas-Wu/url_collections_app)

Discord bot that allows you to directly access the UCollection features from discord servers!
<br/><br/>

# Invite it to your server

[@Invite Bot](https://discord.com/oauth2/authorize?client_id=1339718429615198218&permissions=75776&integration_type=0&scope=bot+applications.commands)

Invite the bot to your server to test it out! Keep in mind the cold startup of the UCollection server.
<br/><br/>

# Commands 
**/short**

Parameters:

url: url to shorten

name: custom name for url

Pass it a url and it will shorten it and sends the shortened version in the server
<br/><br/>

**/cc**

Parameters:

name: custom name for the collection

Creates a new collection and sends it in the server
<br/><br/>

**/collection**

Parameters:

collection: url of the collection

Fetch a collection and send in server
<br/><br/>

**/add**

Parameters:

collection: Url of the collection

url: url to shorten

urlshort: shortened url (if already created)

urlname: name for new url

Shortens url or takes already shortened url and adds it to a collection
<br/><br/>

**/clear**

Parameters:

time: time to check in seconds

Clears server chat of bot messages
<br/><br/>

**/grab**

Parameters:

time: time to check in seconds

collection: collection to add to, creates a new collection if not specified

delete: delete the messages in the server (Y/N)

Grabs urls from messages in the server and adds them to a collection, optionally deletes the original message
