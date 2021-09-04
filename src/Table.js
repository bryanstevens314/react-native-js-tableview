import React, { Component } from 'react';
import { ScrollView, View, ViewPropTypes, KeyboardAvoidingView } from 'react-native';
import PropTypes from 'prop-types';

import { COLOR_ACCENT, getColorPalette } from './assets/colors';
import { ThemeProvider } from './ThemeContext';

import { tableStyles as styles } from './styles';

class Table extends Component {
	static propTypes = {
		accentColor: PropTypes.string,
		theme: PropTypes.oneOf(['light', 'dark', 'midnight']),
		blendAccent: PropTypes.bool,
		colorPalette: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.object,
		]),

		style: ViewPropTypes.style,
		scrollViewStyle: ViewPropTypes.style,

		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.element),
			PropTypes.PropTypes.element,
		]),
		scrollable: PropTypes.bool,
		disabled: PropTypes.bool,
	};

	static defaultProps = {
		accentColor: COLOR_ACCENT,
		theme: 'light',
		blendAccent: false,
		disabled: false,

		scrollable: false,
	};

	render() {
		const { style, scrollViewStyle, scrollViewParentStyle, children, scrollViewRef } = this.props;
		const { scrollable, accentColor, theme, blendAccent, colorPalette, disabled } = this.props;

		let palette = getColorPalette(theme, blendAccent, accentColor);

		if (!!colorPalette) {
			const isFunc = typeof colorPalette === 'function';

			if (isFunc) {
				palette = colorPalette(palette);
			} else {
				palette = colorPalette;
			}
		}

		const renderTable = () => {
			const tableStyle = [styles.table, style];

			if (!scrollable) {
				tableStyle.unshift(styles.container(palette));
			}

			return (
				<View style={tableStyle}>
					{children}
				</View>
			);
		};

		const wrapScrollView = (component) => {
			if (scrollable) {
				return (
					<KeyboardAvoidingView
					  behavior={"height"}
					  style={scrollViewParentStyle}
					  keyboardVerticalOffset={0}>
						<ScrollView ref={scrollViewRef} style={[styles.container(palette), scrollViewStyle]}>
							{component}
						</ScrollView>
					</KeyboardAvoidingView>
				);
			} else {
				return component;
			}
		};

		return (
			<ThemeProvider value={{ colorPalette: palette, disabled }}>
				{wrapScrollView(renderTable())}
			</ThemeProvider>
		);
	}
}

export default Table;
