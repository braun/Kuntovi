export HOST=$1
export ROOT=$2
export PWD=$3
export PREFIX=$4
export JSON_PWD=\"$PWD\"
export SHOST="http://$ROOT:$PWD@$HOST"
export ARTICLES_DB=$SHOST/${PREFIX}_articles
export IMAGES_DB=$SHOST/${PREFIX}_images

echo $JSON_PWD
curl -X PUT $ARTICLES_DB
curl -X PUT $IMAGES_DB

curl -X PUT $HOST/_config/admins/$ROOT -d $JSON_PWD

curl -X PUT $SHOST/_users/org.couchdb.user:braunie \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"name": "braunie", "password": "vrkumr74", "roles": [ "blogger"], "type": "user"}'

curl -X POST $ARTICLES_DB \
-H 'content-type:application/json' \
-d $'{"_id":"_design/only_correct_user","validate_doc_update":"function (newDoc, oldDoc, userCtx) {console.error(userCtx.name);\\nif (userCtx.roles.indexOf(\'_admin\') == -1 && newDoc.user != userCtx.name) {\\nconsole.error(newDoc.user);throw({forbidden : \\"doc.user must be the same as your username.\\"});\\n}\\n}"}'


curl -X POST $IMAGES_DB \
-H 'content-type:application/json' \
-d $'{"_id":"_design/only_correct_user","validate_doc_update":"function (newDoc, oldDoc, userCtx) {console.error(userCtx.name);\\nif (userCtx.roles.indexOf(\'_admin\') == -1 && newDoc.user != userCtx.name) {\\nconsole.error(newDoc.user);throw({forbidden : \\"doc.user must be the same as your username.\\"});\\n}\\n}"}'
