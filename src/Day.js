'use strict';

import React    from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	Text
}               from 'react-native';
import { testID } from '../../../src/common/testID';

export default class Day extends React.Component {
	render() {
		let {date, status, disabled, onDayPress, width, TextComponent, testId} = this.props;
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
				testId = `day.${testId}.disabled`;
				break;

			case 'common':
				backColor = this.props.dayCommonBackColor;
				textColor = this.props.dayCommonTextColor;
				style = this.props.dayCommonStyle;
				testId = `day.${testId}.common`;
				break;

			case 'selectedFrom':
				backColor = this.props.daySelectedBackColor;
				textColor = this.props.daySelectedTextColor;
				style = this.props.daySelectedFromStyle;
				testId = `day.${testId}.from`;
				break;

			case 'selectedTo':
				backColor = this.props.daySelectedBackColor;
				textColor = this.props.daySelectedTextColor;
				style = this.props.daySelectedToStyle;
				testId = `day.${testId}.to`;
				break;

			case 'selectedSingleDay':
				backColor = this.props.daySelectedBackColor;
				textColor = this.props.daySelectedTextColor;
				style = this.props.daySelectedSingleStyle;
				testId = `day.${testId}.single`;
				break;

			case 'inRange':
				backColor = this.props.dayInRangeBackColor;
				textColor = this.props.dayInRangeTextColor;
				style = this.props.dayInRangeStyle;
				testId = `day.${testId}.range`;
				break;
		}

		return (
			<TouchableOpacity
				activeOpacity={disabled ? 1 : 0.5}
				style={[styles.common, style, {backgroundColor: backColor, width: width / 7, height: width / 7}]}
				onPress={onPress}
				{...testID(testId)}
			>
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
