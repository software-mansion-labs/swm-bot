const ReproValidator = require('./ReproValidator');

describe('ReproValidator', () => {
  describe('_hasSnackOrRepo', () => {
    it('should return false when issue body is empty', () => {
      const issueBody = ``;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasSnackOrRepo()).toBe(false);
    });

    it('should return false when no snack or repo', () => {
      const issueBody = `## Reproduction`;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasSnackOrRepo()).toBe(false);
    });

    it('should return true when snack provided', () => {
      const issueBody = `
        ## Reproduction
        https://snack.expo.dev/@kacperkapusciak/example
      `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasSnackOrRepo()).toBe(true);
    });

    it('should return true when repo provided', () => {
      const issueBody = `
      ## Reproduction
      https://github.com/kacperkapusciak/my-amazing-repro
    `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasSnackOrRepo()).toBe(true);
    });

    it('should return true when both repo and snack provided', () => {
      const issueBody = `
      ## Reproduction
      https://snack.expo.dev/@kacperkapusciak/example
      https://github.com/kacperkapusciak/my-amazing-repro
    `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasSnackOrRepo()).toBe(true);
    });
  });

  describe('_isSectionEmpty', () => {
    it('should return true when section is empty', () => {
      const issueBody = `
      ## Reproduction
    `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._isSectionEmpty()).toBe(true);
    });

    it('should return true when issue body is empty', () => {
      const issueBody = ``;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._isSectionEmpty()).toBe(true);
    });

    it('should return false when section is not empty', () => {
      const issueBody = `
      ## Reproduction
      The quick brown fox jumps over the lazy dog
    `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._isSectionEmpty()).toBe(false);
    });

    it('should ignore comments', () => {
      const issueBody = `
      ## Reproduction

      <!--A comment-->
    `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._isSectionEmpty()).toBe(true);
    });

    it('should ignore multiline comments', () => {
      const issueBody = `
      ## Reproduction

      <!--
      A comment
      -->
    `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._isSectionEmpty()).toBe(true);
    });
  });

  describe('_hasFunctions', () => {
    it('should return true when snippet has functions', () => {
      const issueBody = `
      import React from 'react';
      import {View, Text, Button} from 'react-native';
      import {NavigationContainer} from '@react-navigation/native';
      import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
      import {createStackNavigator} from '@react-navigation/stack';
      
      const Tab = createBottomTabNavigator();
      
      function Screen1({navigation}) {
        return (
          <View
            style={{
              backgroundColor: 'green',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: 'white'}}>Screen 1</Text>
            <Button
              onPress={() => navigation.navigate('Screen2')}
              title="Go to Screen 2"
            />
          </View>
        );
      }
    `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasFunctions()).toBe(true);
    });

    it('should return false when snippet has no functions', () => {
      const issueBody = `
      import React from 'react';
      import {View, Text, Button} from 'react-native';
      import {NavigationContainer} from '@react-navigation/native';
      import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
      import {createStackNavigator} from '@react-navigation/stack';
    `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasFunctions()).toBe(false);
    });

    it('should return false when snippet is empty', () => {
      const issueBody = ``;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasFunctions()).toBe(false);
    });
  });

  describe('_hasVariables', () => {
    it('should return true when snippet has const variable', () => {
      const issueBody = `const Tab = createBottomTabNavigator();`;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasFunctions()).toBe(true);
    });

    it('should return true when snippet has let variable', () => {
      const issueBody = `let Tab = createBottomTabNavigator();`;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasFunctions()).toBe(true);
    });

    it('should return true when snippet has var variable', () => {
      const issueBody = `var Tab = createBottomTabNavigator();`;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasFunctions()).toBe(true);
    });

    it('should return false when const/let/var is used in a sentence', () => {
      const issueBody = `This variable constantly lets us to do something.`;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasFunctions()).toBe(false);
    });

    it('should return false when snippet is empty', () => {
      const issueBody = ``;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasFunctions()).toBe(false);
    });
  });

  describe('_hasBackticks', () => {
    it('should return true when snippet has 3 backticks', () => {
      const issueBody = `
      \`\`\`
      function App() {
        return (
          <NavigationContainer>
            <MainStack.Navigator>
              <MainStack.Screen name="Tabs" component={Tabs} />
            </MainStack.Navigator>
          </NavigationContainer>
        );
      }
      
      export default App;
      \`\`\`
      `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasBackticks()).toBe(true);
    });

    it('should return false when snippet has no backticks', () => {
      const issueBody = `
      import React from 'react';
      import {View, Text, Button} from 'react-native';
      import {NavigationContainer} from '@react-navigation/native';
      import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
      import {createStackNavigator} from '@react-navigation/stack';
      `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasBackticks()).toBe(false);
    });

    it('should return false when snippet is empty', () => {
      const issueBody = ``;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasBackticks()).toBe(false);
    });
  });

  describe('_hasImports', () => {
    it('should return true when snippet has imports', () => {
      const issueBody = `
      import React from 'react';
      import {View, Text, Button} from 'react-native';
      import {NavigationContainer} from '@react-navigation/native';
      import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
      import {createStackNavigator} from '@react-navigation/stack';
    `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasImports()).toBe(true);
    });

    it('should return false when snippet has no imports', () => {
      const issueBody = `
      export const maybePopToTop = navigation => {
        const state = navigation.getState().routes;
      };
      export default App;
    `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasImports()).toBe(false);
    });

    it('should return false when snippet is empty', () => {
      const issueBody = ``;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasImports()).toBe(false);
    });
  });

  describe('_hasExports', () => {
    it('should return true when snippet has exports', () => {
      const issueBody = `
      export const maybePopToTop = navigation => {
        const state = navigation.getState().routes;
      };
      export default App;
    `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasExports()).toBe(true);
    });

    it('should return false when snippet has no exports', () => {
      const issueBody = `
      import React from 'react';
      import {View, Text, Button} from 'react-native';
      import {NavigationContainer} from '@react-navigation/native';
      import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
      import {createStackNavigator} from '@react-navigation/stack';
    `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasExports()).toBe(false);
    });

    it('should return false when snippet is empty', () => {
      const issueBody = ``;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasExports()).toBe(false);
    });
  });

  describe('_hasJSX', () => {
    it('should return true when snippet has JSX', () => {
      const issueBody = `
      <View>
        <Button
          title="scroll down"
          onPress={() => {
            scroll.value = scroll.value + 1;
            if (scroll.value >= 10) scroll.value = 0;
          }}
        />
      </View>
    `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasJSX()).toBe(true);
    });

    it('should return false when snippet has no JSX', () => {
      const issueBody = `
      import React from 'react';
      import {View, Text, Button} from 'react-native';
      import {NavigationContainer} from '@react-navigation/native';
      import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
      import {createStackNavigator} from '@react-navigation/stack';
    `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasJSX()).toBe(false);
    });

    it('should return false when snippet is empty', () => {
      const issueBody = ``;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasJSX()).toBe(false);
    });
  });

  describe('_hasJavaScriptOrTypeScriptCode', () => {
    it('should return true for real reproduction from react-native-screens', () => {
      const issueBody = `
      import React from "react";
      import { NavigationContainer } from "@react-navigation/native";
      import { createNativeStackNavigator } from "react-native-screens/native-stack";
      
      const Stack = createNativeStackNavigator();
      
      const Screen = () => {
        return null;
      };
      
      const App = () => {
        return (
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Screen"
              screenOptions={{
                headerTitle: "Title",
                searchBar: {}
              }}>
              <Stack.Screen
                name="Screen"
                component={Screen} />
            </Stack.Navigator>
          </NavigationContainer>
        );
      };
      
      export default App;
    `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasJavaScriptOrTypeScriptCode()).toBe(true);
    });

    it('should return true for real reproduction from react-native-reanimated', () => {
      const issueBody = `
      const Comp = () => {
        const aref = useAnimatedRef<FlatList>();
        const scroll = useSharedValue(0);
        const { width, height } = useWindowDimensions();
      
        useDerivedValue(() => {
          scrollTo(aref, 0, scroll.value * height, true);
        });
      
        const items = Array.from(Array(10).keys());
      
        const animatedScrollHandler = useAnimatedScrollHandler<{
          beginOffset: number
        }>({
          onBeginDrag: (e, c) => {
            c.beginOffset = e.contentOffset.y;
          },
          onEndDrag: (e, c) => {
            const currentOffset = e.contentOffset.y;
            const direction = currentOffset > c.beginOffset ? "down" : "up";
            scroll.value =
              direction === "up" ? scroll.value - 1 : scroll.value + 1;
          }
        });
      
        return (
          <View>
            <Button
              title="scroll down"
              onPress={() => {
                scroll.value = scroll.value + 1;
                if (scroll.value >= 10) scroll.value = 0;
              }}
            />
            <View style={{ width, height, backgroundColor: "green" }}>
              <AnimatedFlatList
                ref={aref}
                data={items}
                onScroll={animatedScrollHandler}
                style={{ backgroundColor: "orange", width }} renderItem={(itemInfo: any) => (
                <View
                  key={itemInfo.item}
                  style={{
                    backgroundColor: "white",
                    width: width - 20,
                    height: height - 50,
                    marginHorizontal: 10,
                    borderBottomWidth: 2,
                    borderBottomColor: "orange",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text style={{ fontSize: 48 }}>{itemInfo.item}</Text>
                </View>
              )}>
              </AnimatedFlatList>
            </View>
          </View>
        );
      };
    `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasJavaScriptOrTypeScriptCode()).toBe(true);
    });

    it('should return true for another real reproduction from react-native-reanimated', () => {
      const issueBody = `
      function CountUp({ value }) {
        const animatedValue = useSharedValue(value);
        const text = useDerivedValue(() => \`\$\{animatedValue.value\}\`, [animatedValue]);
      
        useEffect(() => {
          animatedValue.value = withTiming(value);
        }, [value]);
      
        return (<ReText text={text} />)
      }
      `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasJavaScriptOrTypeScriptCode()).toBe(true);
    });

    it('should return true for real reproduction from react-native-gesture-handler', () => {
      const issueBody = `
      \`\`\`
      import {ScrollView, Text} from 'react-native';
      import Swipeable from 'react-native-gesture-handler/Swipeable';
      ...
      <Swipeable
          onSwipeableRightOpen={this.refuseOrder}
          renderRightActions={this.renderRefuse}
      >
        <Text>This is not scrollable text.</Text>
        <ScrollView horizontal>
          <Text>Here is some long text which is bigger than screen width. Here is some long text which is bigger than screen width.</Text>
        </ScrollView>
      </Swipeable>
      \`\`\`
      `;
      const reproValidator = new ReproValidator(issueBody, 'Reproduction', 'kacperkapusciak');

      expect(reproValidator._hasJavaScriptOrTypeScriptCode()).toBe(true);
    });
  });
});
