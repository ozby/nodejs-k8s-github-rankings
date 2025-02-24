```
helm plugin install https://github.com/helm-unittest/helm-unittest.git
helm unittest .


helm upgrade --install challenge . \
    --namespace challenge-202502 \
    --set mongodb.host="$MONGODB_HOST" \
    --set mongodb.database="$MONGODB_DATABASE" \
    --set mongodb.username="$MONGODB_USERNAME" \
    --set mongodb.password="$MONGODB_PASSWORD" \
    --wait
    
    

kubectl create job --from=cronjob/challenge-202502-mongoimport manual-import --namespace challenge-202502
kubectl logs -n challenge-202502 job/manual-import -c download-csv -f &
kubectl logs -n challenge-202502 job/manual-import -c mongoimport -f
```