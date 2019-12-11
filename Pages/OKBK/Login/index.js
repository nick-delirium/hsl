import React, { PureComponent } from 'react'
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Linking,
} from 'react-native'
import { connect } from 'react-redux'
import colors from '@/constants/Colors'
import fonts from '@/constants/Styles'
import { singIn } from '../reducer'

const { height } = Dimensions.get('window')
const { width } = Dimensions.get('window')

const StyledText = ({ children, style, onPress }) => (
  <Text
    style={{
      ...styles.text,
      ...style,
      textAlign: 'center',
    }}
    onPress={onPress}
  >
    {children}
  </Text>
)

class Login extends PureComponent {
  constructor(props) {
    super(props)

    this.passwordRef = React.createRef()
    this.emailRef = React.createRef()
    this.state = {
      email: '',
      isEmailInvalid: false,
      password: '',
      shouldShowError: true,
    }
  }

  focusPassword = () => {
    const { email } = this.state
    const isValid = email.length > 5
      && email.includes('@')
    if (isValid) {
      this.setState({ isEmailInvalid: false })
      this.passwordRef.current.focus()
    } else {
      this.setState({ isEmailInvalid: true })
    }
  }

  onSubmit = () => {
    const { email, password } = this.state

    const { actions } = this.props
    if (email !== '' && password !== '') {
      this.setState({ isEmailInvalid: false, shouldShowError: true })
      actions.singIn({ email, password })
    }
  }

  render() {
    const {
      email,
      isEmailInvalid,
      password,
      shouldShowError,
    } = this.state
    const { error } = this.props
    const isDisabled = email === '' || password === ''
    return (
      <View style={styles.pageWrapper}>
        <View style={styles.formWrapper}>
          <StyledText style={{ fontWeight: 'bold', color: colors.orange }}>
            {'Вход для членов\nзакрытого бизнес-клуба\nОКБК'}
          </StyledText>
          <StyledText style={{ marginTop: 10 }}>
            {'По всем вопросам\nобращайтесь по эл.почте:'}
          </StyledText>
          <StyledText
            style={{ color: colors.orange }}
            onPress={() => Linking.openURL('mailto:info@hansanglab.com')}
          >
            info@hansanglab.com
          </StyledText>

          <View style={styles.form}>

            <View style={{ ...styles.inputWrapper, borderColor: isEmailInvalid ? colors.red : 'transparent' }}>
              <TextInput
                enablesReturnKeyAutomatically
                blurOnSubmit={false}
                ref={this.emailRef}
                autoCompleteType="email"
                autoCapitalize="none"
                keyboardAppearance="dark"
                keyboardType="email-address"
                onChangeText={(value) => {
                  this.setState({ email: value, shouldShowError: false })
                }}
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
            {shouldShowError && error && (
              <View style={{ alignItems: 'center', marginTop: 20, width: '100%' }}>
                <View style={styles.triangle} />
                <View style={styles.error}>
                  <Text style={{ color: colors.red, textAlign: 'center' }}>{error}</Text>
                </View>
              </View>
            )}
            <TouchableOpacity
              onPress={this.onSubmit}
              style={{
                ...styles.button,
                backgroundColor: isDisabled ? '#e05a86' : colors.red,
              }}
              disabled={isDisabled}
              activeOpacity={0.6}
            >
              <StyledText>
                Войти
              </StyledText>
            </TouchableOpacity>
          </View>

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
    backgroundColor: colors.purple,
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
    marginTop: 20,
  },
  inputWrapper: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'transparent',
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
    height: '35%',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#CFCFF9',
  },
  error: {
    backgroundColor: '#CFCFF9',
    padding: 8,
    borderRadius: 3,
    width: '100%',
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
