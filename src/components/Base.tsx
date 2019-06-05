import * as React from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider } from 'baseui';

import Routes from './Routes';

const Base: React.FC = () => {
	const engine = new Styletron();
	return (
		<StyletronProvider value={engine}>
			<BaseProvider theme={LightTheme}>
				<Routes />
			</BaseProvider>
		</StyletronProvider>
	);
};

export default Base;
