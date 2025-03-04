```
helm plugin install https://github.com/helm-unittest/helm-unittest.git
helm unittest .


helm upgrade --install nodejs-k8s-github-rankings . \
    --namespace nodejs-k8s-github-rankings \
    --set mongodb.host="$MONGODB_HOST" \
    --set mongodb.database="$MONGODB_DATABASE" \
    --set mongodb.username="$MONGODB_USERNAME" \
    --set mongodb.password="$MONGODB_PASSWORD" \
    --wait
    
    

kubectl create job --from=cronjob/nodejs-k8s-github-rankings-mongoimport manual-import --namespace nodejs-k8s-github-rankings
kubectl logs -n nodejs-k8s-github-rankings job/manual-import -c download-csv -f &
kubectl logs -n nodejs-k8s-github-rankings job/manual-import -c mongoimport -f
```