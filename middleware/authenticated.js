import gql from 'graphql-tag'

export default async function ({ app, redirect }) {
    const hasToken = !!app.$apolloHelpers.getToken();
    if (!hasToken) return redirect('/admin/login');

    // make sure token is still valid
    try {
        const { data: { me } } = await app.apolloProvider.defaultClient.query({
            query: gql`
                query {
                    me {
                        id
                        name
                        email
                    }
                }
            `
        })

        if (!Object.keys(me).length) {
            return redirect('/admin/login');
        }
    } catch (e) {
        try {
            await app.$apolloHelpers.onLogout();
            return redirect('/admin/login');
        } catch (e) {
            console.error(e);
        }
    }
}