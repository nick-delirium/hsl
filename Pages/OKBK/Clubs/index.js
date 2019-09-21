import React, { PureComponent } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native'
import { connect } from 'react-redux'
import colors from '../colors'
import { fonts } from '@/constants/Styles'
import { singIn } from '../reducer'
import Card from '@/components/Card'

const { height } = Dimensions.get('window')
const { width } = Dimensions.get('window')

const StyledText = ({ children, withMargin }) => (
  <Text style={{ ...styles.text, marginTop: withMargin ? 20 : 0 }}>{children}</Text>
)

class Clubs extends PureComponent {
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

    // debug
    const { actions } = this.props
    actions.singIn({ email, password })
  }

  render() {
    return (
      <View style={styles.pageWrapper}>
        <Card>
          <Text>Деловой клубешник</Text>
          <Image
            style={styles.logo}
            source={require('../../../assets/images/OKBK/logo_OKBK.png')}
          />
        </Card>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  pageWrapper: {
    width,
    height,
  },
  text: {
    color: colors.text,
    fontSize: fonts.normal,
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
)(Clubs)
