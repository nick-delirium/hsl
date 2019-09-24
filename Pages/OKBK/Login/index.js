import React, { PureComponent } from 'react'
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native'
import { connect } from 'react-redux'
import colors from '../colors'
import { fonts } from '@/constants/Styles'
import { singIn } from '../reducer'

const { height } = Dimensions.get('window')
const { width } = Dimensions.get('window')

const StyledText = ({ children, withMargin }) => (
  <Text style={{ ...styles.text, marginTop: withMargin ? 20 : 0 }}>{children}</Text>
)

class Login extends PureComponent {
  constructor(props) {
    super(props)

    this.passwordRef = React.createRef()
    this.emailRef = React.createRef()
    this.state = {
      email: '',
      password: '',
    }
  }

  focusPassword = () => {
    const { email } = this.state
    const isValid = email.length > 5
      && email.includes('@')
    if (isValid) this.passwordRef.current.focus()
  }

  onSubmit = () => {
    const { email, password } = this.state
    console.log(email, password)

    const { actions } = this.props
    if (email !== '' && password !== '') actions.singIn({ email, password })
  }

  render() {
    const { email, password } = this.state
    const { error } = this.props
    const isDisabled = email === '' || password === ''
    return (
      <View style={styles.pageWrapper}>
        <View style={styles.formWrapper}>
          <StyledText> Для просмотра </StyledText>
          <StyledText> необходима авторизация </StyledText>

          <View style={styles.form}>

            <View style={styles.inputWrapper}>
              <TextInput
                enablesReturnKeyAutomatically
                blurOnSubmit={false}
                ref={this.emailRef}
                autoCompleteType="email"
                autoCapitalize="none"
                keyboardAppearance="dark"
                keyboardType="email-address"
                onChangeText={(value) => this.setState({ email: value })}
                placeholder="Почта"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                returnKeyType="next"
                textContentType="emailAddress"
                style={styles.input}
                value={email}
                onSubmitEditing={this.focusPassword}
              />
            </View>

            <View style={{ ...styles.inputWrapper, marginTop: 20 }}>
              <TextInput
                enablesReturnKeyAutomatically
                secureTextEntry
                ref={this.passwordRef}
                autoCompleteType="password"
                autoCapitalize="none"
                keyboardAppearance="dark"
                autoFocus={false}
                keyboardType="default"
                onChangeText={(value) => this.setState({ password: value })}
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                returnKeyType="go"
                placeholder="Пароль"
                textContentType="password"
                style={styles.input}
                value={password}
                onSubmitEditing={this.onSubmit}
              />
            </View>

            <TouchableOpacity
              onPress={this.onSubmit}
              style={{
                ...styles.button,
                backgroundColor: isDisabled ? '#e05a86' : '#B62655',
              }}
              activeOpacity={0.6}
            >
              <StyledText>
                Войти
              </StyledText>
            </TouchableOpacity>
          </View>
          {error && (
            <Text>{error}</Text>
          )}
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={require('../../../assets/images/OKBK/logo_01.png')}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  pageWrapper: {
    width,
    height,
    backgroundColor: colors.loginBg,
  },
  text: {
    color: colors.text,
    fontSize: fonts.normal,
  },
  button: {
    borderRadius: 3,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 30,
  },
  inputWrapper: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginTop: 5,
  },
  input: {
    width: '100%',
    padding: 15,
    textAlign: 'center',
    color: colors.text,
    fontSize: fonts.normal,
  },
  formWrapper: {
    width: '70%',
    marginTop: 20,
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  logo: {
    // width: '160%',
    height: '40%',
  },
})

const mapStateToProps = () => ({})
const mapDispatchToProps = (dispatch) => ({
  actions: {
    singIn: (account) => dispatch(singIn(account)),
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login)
