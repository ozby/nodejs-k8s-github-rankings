version_settings(constraint='>=0.22.2')

load('ext://namespace', 'namespace_create')
namespace_create('challenge-202502')


load('ext://helm_resource', 'helm_resource', 'helm_repo')

helm_repo('bitnami', 'https://charts.bitnami.com/bitnami', labels=['common'])

helm_resource('mongodb', 'bitnami/mongodb', flags=['--values=mongodb_values.yaml', '--version=12.1.31'], namespace='challenge-202502', resource_deps=['bitnami'])
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


k8s_yaml('infra/dev/api-nest.yaml')

k8s_resource(
    'api-nest',
    labels=['backend']
)


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
    \033[32m\033[32mHello World from ozby's challenge-202502!\033[0m

    `{tiltfile}`
    """.format(tiltfile=tiltfile_path))
