export HOST=$1
export PORT=$2
export ROOT=$3
export PWD=$4
export JSON_PWD=\"$PWD\"
export SHOST="http://$ROOT:$PWD@$HOST:$PORT"
echo $JSON_PWD
curl -X PUT $HOST/articles
curl -X PUT $HOST/images

curl -X PUT $SHOST/_config/admins/$ROOT -d $JSON_PWD

curl -X PUT $SHOST/_users/org.couchdb.user:braunie \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"name": "braunie", "password": "vrkumr74", "roles": [ "blogger"], "type": "user"}'

curl -X POST $SHOST/articles \
-H 'content-type:application/json' \
-d $'{"_id":"_design/only_correct_user","validate_doc_update":"function (newDoc, oldDoc, userCtx) {console.error(userCtx.name);\\nif (userCtx.roles.indexOf(\'_admin\') == -1 && newDoc.user != userCtx.name) {\\nconsole.error(newDoc.user);throw({forbidden : \\"doc.user must be the same as your username.\\"});\\n}\\n}"}'