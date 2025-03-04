version_settings(constraint='>=0.22.2')

load('ext://namespace', 'namespace_create')
namespace_create('nodejs-k8s-github-rankings')
load('ext://helm_resource', 'helm_resource', 'helm_repo')

helm_repo('bitnami', 'https://charts.bitnami.com/bitnami', labels=['common'])

mongodb_username = 'mongo_user'
mongodb_password = 'mongo_pw'
mongodb_database = 'mongo_db'
mongodb_version = '14.13'


helm_resource(
    'mongodb',
    'bitnami/mongodb',
    flags=[
        '--values=./mongodb_values.yaml',
        '--set=auth.databases[0]=' + mongodb_database,
        '--set=auth.usernames[0]=' + mongodb_username,
        '--set=auth.passwords[0]=' + mongodb_password,
        '--set=livenessProbe.enabled=false',
        '--set=readinessProbe.enabled=false',
        '--version=' + mongodb_version,
    ],
    namespace='nodejs-k8s-github-rankings',
    resource_deps=['bitnami']
)
k8s_resource('mongodb', port_forwards=[27017], labels=['common'], trigger_mode=TRIGGER_MODE_MANUAL)

docker_build(
    'api-nest',
    context='.',
    dockerfile='./infra/dev/api-nest.dockerfile',
    only=['./app/'],
    ignore=['./app/dist/'],
    live_update=[
        fall_back_on('./app/nest-cli.json'),
        sync('./app/src', '/app/src'),
        run(
            'npm install',
            trigger=['./app/package.json', './app/package-lock.json']
        )
    ]
)

k8s_yaml(
    helm(
        './infra',
        name='app',
        namespace='nodejs-k8s-github-rankings',
        set=[
            'deployment.image="api-nest"',
            'mongodb.host="mongodb"',
            'mongodb.database=' + mongodb_database,
            'mongodb.username=' + mongodb_username,
            'mongodb.password=' + mongodb_password
        ],
  )
)
k8s_resource('nodejs-k8s-github-rankings-app', port_forwards=[3000], labels=['app'])

local_resource(
   'trigger-import',
   'kubectl create job --from=cronjob/app-mongoimport manual-import-$(date +%s) --namespace nodejs-k8s-github-rankings',
    resource_deps=['nodejs-k8s-github-rankings-app'], labels=['app'], trigger_mode=TRIGGER_MODE_MANUAL
)

k8s_resource('app-mongoimport', labels=['app-cronjob'])


# config.main_path is the absolute path to the Tiltfile being run
# there are many Tilt-specific built-ins for manipulating paths, environment variables, parsing JSON/YAML, and more!
# https://docs.tilt.dev/api.html#api.config.main_path
tiltfile_path = config.main_path

# print writes messages to the (Tiltfile) log in the Tilt UI
# the Tiltfile language is Starlark, a simplified Python dialect, which includes many useful built-ins
# config.tilt_subcommand makes it possible to only run logic during `tilt up` or `tilt down`
# https://github.com/bazelbuild/starlark/blob/master/spec.md#print
# https://docs.tilt.dev/api.html#api.config.tilt_subcommand
if config.tilt_subcommand == 'up':
    print("""
    \033[32m\033[32mHello World from ozby's nodejs-k8s-github-rankings!\033[0m

    `{tiltfile}`
    """.format(tiltfile=tiltfile_path))
