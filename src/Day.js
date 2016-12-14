'use strict';

import React    from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	Text
}               from 'react-native';

export default class Day extends React.Component {
	render() {
		let {date, status, disabled, onDayPress, width, TextComponent} = this.props;
		let onPress, textColor, backColor, style;

		if (disabled) {
			status = 'disabled';
			onPress = null;
		} else {
			onPress = () => {
				onDayPress(date);
			}
		}

		switch (status) {
			case 'disabled':
				backColor = this.props.dayDisabledBackColor;
				textColor = this.props.dayDisabledTextColor;
				style = this.props.dayDisabledStyle;
				break;

			case 'common':
				backColor = this.props.dayCommonBackColor;
				textColor = this.props.dayCommonTextColor;
				style = this.props.dayCommonStyle;
				break;

			case 'selectedFrom':
				backColor = this.props.daySelectedBackColor;
				textColor = this.props.daySelectedTextColor;
				style = this.props.daySelectedFromStyle;
				break;

			case 'selectedTo':
				backColor = this.props.daySelectedBackColor;
				textColor = this.props.daySelectedTextColor;
				style = this.props.daySelectedToStyle;
				break;

			case 'selectedSingleDay':
				backColor = this.props.daySelectedBackColor;
				textColor = this.props.daySelectedTextColor;
				style = this.props.daySelectedSingleStyle;
				break;

			case 'inRange':
				backColor = this.props.dayInRangeBackColor;
				textColor = this.props.dayInRangeTextColor;
				style = this.props.dayInRangeStyle;
				break;
		}

		return (
			<TouchableOpacity
				activeOpacity={disabled ? 1 : 0.5}
				style={[styles.common, style, {backgroundColor: backColor, width: width / 7, height: width / 7}]}
				onPress={onPress}>
				<TextComponent style={{color: textColor}}>{date.getDate()}</TextComponent>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	common: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white'
	}
});
