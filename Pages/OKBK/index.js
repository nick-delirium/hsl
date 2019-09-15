import React, { PureComponent } from 'react'
import {
  View,
  Text,
} from 'react-native'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import { ApolloProvider, Query } from 'react-apollo'
import ApolloClient, { gql } from 'apollo-boost'
import Login from './Login'

const client = new ApolloClient({
  uri: 'https://hansanglab.com/superapi/',
})

const TEST_QUERY = gql`
  query auth ($email: String!, $password: String!) {
    auth (email: $email, password: $password) {
      result,
      code,
      message,
      sessionId,
      groups { id, name }
    }
  }
`

class OKBK extends PureComponent {
  render() {
    const { isLoggedIn } = this.props
    if (!isLoggedIn) return <Login />

    return (
      <ApolloProvider client={client}>
        <Query query={TEST_QUERY} variables={{ email: 'login@mail.com', password: 'abracadabra' }}>
          {({ data, loading, error }) => {
            if (loading) return <Text>loading</Text>
            if (error) return <Text>{JSON.stringify(error)} error</Text>
            if (data) {
              console.log(Object.keys(data), data)
              return (
                <View>
                  <Text>123</Text>
                </View>
              )
            }
          }}
        </Query>
      </ApolloProvider>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  isLoggedIn: (state) => get(state, 'okbk.isLoggedIn'),
  currentTab: (state) => get(state, 'okbk.currentTab'),
})

export default connect(mapStateToProps)(OKBK)
