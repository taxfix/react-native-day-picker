'use strict';

import React    from 'react';
import {
	View,
	StyleSheet,
	Text
}               from 'react-native';
import Day      from './Day';
import { testID } from '../../../src/common/testID';

export default class Month extends React.Component {
	constructor(props) {
		super(props);

		this.weekDaysLocale = props.weekDaysLocale.slice();

		if (props.startFromMonday) {
			this.weekDaysLocale.push(this.weekDaysLocale.shift());
		}
	}

	render() {
		let {
			days, changeSelection, style, monthsLocale,
			bodyBackColor, bodyTextColor, headerSepColor, width, monthTextColor,
			TextComponent,
		} = this.props;

		var monthHeader = monthsLocale[days[15].date.getMonth()] + ' ' + days[15].date.getFullYear();

		return (
			<View style={[style, {width: width, backgroundColor: bodyBackColor}]} {...testID(monthHeader)}>
				<TextComponent style={[styles.monthHeader, {color: monthTextColor || bodyTextColor}]}>
					{monthHeader}
				</TextComponent>
				<View style={styles.monthDays}>
					{this.weekDaysLocale.map((dayName, i) => {
						return (
							<View
								key={i}
								style={[styles.weekDay, {
									borderColor: headerSepColor,
									width: width / 7,
									height: width / 7
								}]}
							>
								<TextComponent style={{color: bodyTextColor}}>{dayName}</TextComponent>
							</View>
						);
					})}
					{days.map((day, i) => {
						return (
							<Day
								key={i}
								{...this.props}
								disabled={day.disabled}
								status={day.status}
								date={day.date}
								onDayPress={changeSelection}
								testId={`${day.date.getDate()}`}
							/>
						);
					})}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	monthHeader: {
		marginTop: 15,
		marginBottom: 5,
		fontWeight: 'bold',
		alignSelf: 'center'
	},
	monthDays: {
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	weekDay: {
		borderBottomWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
