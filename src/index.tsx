import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache, ApolloClient } from 'apollo-client-preset';
import { WebSocketLink } from 'apollo-link-ws';
import { setContext } from 'apollo-link-context';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { BrowserRouter } from 'react-router-dom';
import { createHttpLink } from 'apollo-link-http';

import { AUTH_TOKEN } from './config/constant';
import { UserProvider } from './context/UserContext';
import Base from './components/Base';

import './styles/index.scss';

const httpLink = createHttpLink({
	uri: 'http://localhost:3000/graphql'
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem(AUTH_TOKEN);
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ''
		}
	};
});

const wsLink = new WebSocketLink({
	uri: `ws://localhost:3000/graphql`,
	options: {
		timeout: 60000,
		reconnect: true,
		connectionParams: {
			authToken: localStorage.getItem(AUTH_TOKEN)
		}
	}
});

const link = split(
	({ query }) => {
		const { kind, operation } = getMainDefinition(query);
		return kind === 'OperationDefinition' && operation === 'subscription';
	},
	wsLink,
	authLink.concat(httpLink)
);

const client = new ApolloClient({
	link,
	cache: new InMemoryCache(),
	connectToDevTools: true
});

const token = localStorage.getItem(AUTH_TOKEN);

ReactDOM.render(
	<ApolloProvider client={client}>
		<UserProvider token={token}>
			<BrowserRouter>
				<Base />
			</BrowserRouter>
		</UserProvider>
	</ApolloProvider>,
	document.getElementById('root')
);
