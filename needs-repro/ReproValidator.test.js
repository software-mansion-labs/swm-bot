const ReproValidator = require('./ReproValidator');

describe('ReproValidator', () => {
  describe('_hasSnackOrRepo', () => {
    it('should return false when issue body is empty', () => {
      const issueBody = ``;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasSnackOrRepo(issueBody)).toBe(false);
    });

    it('should return false when issue body is null', () => {
      const issueBody = null;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasSnackOrRepo(issueBody)).toBe(false);
    });

    it('should return false when issue body is undefined', () => {
      const issueBody = undefined;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasSnackOrRepo(issueBody)).toBe(false);
    });

    it('should return false when no snack or repo', () => {
      const issueBody = `## Reproduction`;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasSnackOrRepo(issueBody)).toBe(false);
    });

    it('should return true when snack provided', () => {
      const issueBody = `
        ## Reproduction
        https://snack.expo.dev/@kacperkapusciak/example
      `;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasSnackOrRepo(issueBody)).toBe(true);
    });

    it('should return true when repo provided', () => {
      const issueBody = `
      ## Reproduction
      https://github.com/kacperkapusciak/my-amazing-repro
    `;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasSnackOrRepo(issueBody)).toBe(true);
    });

    it('should return true when both repo and snack provided', () => {
      const issueBody = `
      ## Reproduction
      https://snack.expo.dev/@kacperkapusciak/example
      https://github.com/kacperkapusciak/my-amazing-repro
    `;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasSnackOrRepo(issueBody)).toBe(true);
    });

    it('should return false when empty snack is provided', () => {
      const issueBody = `https://snack.expo.dev/`;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasSnackOrRepo(issueBody)).toBe(false);
    });

    it('should return true when only snack and nothing else is provided', () => {
      const issueBody = `https://snack.expo.dev/@kacperkapusciak/example`;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasSnackOrRepo(issueBody)).toBe(true);
    });

    it('should return true when only repo and nothing else is provided', () => {
      const issueBody = `https://github.com/kacperkapusciak/react-native-repro/`;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasSnackOrRepo(issueBody)).toBe(true);
    });

    it('should return true when real life example repo is provided', () => {
      const issueBody = `This is my repro for this issue: https://github.com/kacperkapusciak/react-native-repro/`;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasSnackOrRepo(issueBody)).toBe(true);
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
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasFunctions(issueBody)).toBe(true);
    });

    it('should return false when snippet has no functions', () => {
      const issueBody = `
      import React from 'react';
      import {View, Text, Button} from 'react-native';
      import {NavigationContainer} from '@react-navigation/native';
      import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
      import {createStackNavigator} from '@react-navigation/stack';
    `;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasFunctions(issueBody)).toBe(false);
    });

    it('should return false when snippet is empty', () => {
      const issueBody = ``;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasFunctions(issueBody)).toBe(false);
    });

    it('should return false when snippet is null', () => {
      const issueBody = null;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasFunctions(issueBody)).toBe(false);
    });

    it('should return false when snippet is undefined', () => {
      const issueBody = undefined;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasFunctions(issueBody)).toBe(false);
    });
  });

  describe('_hasVariables', () => {
    it('should return true when snippet has const variable', () => {
      const issueBody = `const Tab = createBottomTabNavigator();`;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasFunctions(issueBody)).toBe(true);
    });

    it('should return true when snippet has let variable', () => {
      const issueBody = `let Tab = createBottomTabNavigator();`;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasFunctions(issueBody)).toBe(true);
    });

    it('should return true when snippet has var variable', () => {
      const issueBody = `var Tab = createBottomTabNavigator();`;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasFunctions(issueBody)).toBe(true);
    });

    it('should return false when const/let/var is used in a sentence', () => {
      const issueBody = `This variable constantly lets us to do something.`;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasFunctions(issueBody)).toBe(false);
    });

    it('should return false when snippet is empty', () => {
      const issueBody = ``;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasFunctions(issueBody)).toBe(false);
    });

    it('should return false when snippet is null', () => {
      const issueBody = null;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasFunctions(issueBody)).toBe(false);
    });

    it('should return false when snippet is undefined', () => {
      const issueBody = undefined;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasFunctions(issueBody)).toBe(false);
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
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasBackticks(issueBody)).toBe(true);
    });

    it('should return false when snippet has no backticks', () => {
      const issueBody = `
      import React from 'react';
      import {View, Text, Button} from 'react-native';
      import {NavigationContainer} from '@react-navigation/native';
      import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
      import {createStackNavigator} from '@react-navigation/stack';
      `;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasBackticks(issueBody)).toBe(false);
    });

    it('should return false when snippet is empty', () => {
      const issueBody = ``;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasBackticks(issueBody)).toBe(false);
    });

    it('should return false when snippet is null', () => {
      const issueBody = null;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasBackticks(issueBody)).toBe(false);
    });

    it('should return false when snippet is undefined', () => {
      const issueBody = undefined;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasBackticks(issueBody)).toBe(false);
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
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasImports(issueBody)).toBe(true);
    });

    it('should return false when snippet has no imports', () => {
      const issueBody = `
      export const maybePopToTop = navigation => {
        const state = navigation.getState().routes;
      };
      export default App;
    `;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasImports(issueBody)).toBe(false);
    });

    it('should return false when snippet is empty', () => {
      const issueBody = ``;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasImports(issueBody)).toBe(false);
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
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasExports(issueBody)).toBe(true);
    });

    it('should return false when snippet has no exports', () => {
      const issueBody = `
      import React from 'react';
      import {View, Text, Button} from 'react-native';
      import {NavigationContainer} from '@react-navigation/native';
      import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
      import {createStackNavigator} from '@react-navigation/stack';
    `;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasExports(issueBody)).toBe(false);
    });

    it('should return false when snippet is empty', () => {
      const issueBody = ``;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasExports(issueBody)).toBe(false);
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
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasJSX(issueBody)).toBe(true);
    });

    it('should return false when snippet has no JSX', () => {
      const issueBody = `
      import React from 'react';
      import {View, Text, Button} from 'react-native';
      import {NavigationContainer} from '@react-navigation/native';
      import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
      import {createStackNavigator} from '@react-navigation/stack';
    `;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasJSX(issueBody)).toBe(false);
    });

    it('should return false when snippet is empty', () => {
      const issueBody = ``;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasJSX(issueBody)).toBe(false);
    });

    it('should return false when snippet is null', () => {
      const issueBody = null;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasJSX(issueBody)).toBe(false);
    });

    it('should return false when snippet is undefined', () => {
      const issueBody = undefined;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasJSX(issueBody)).toBe(false);
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
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasJavaScriptOrTypeScriptCode(issueBody)).toBe(true);
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
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasJavaScriptOrTypeScriptCode(issueBody)).toBe(true);
    });

    it('should return true for another real reproduction from react-native-reanimated', () => {
      const issueBody = `
      function CountUp({ value }) {
        const animatedValue = useSharedValue(value);
        const text = useDerivedValue(() => \`$\{animatedValue.value}\`, [animatedValue]);
      
        useEffect(() => {
          animatedValue.value = withTiming(value);
        }, [value]);
      
        return (<ReText text={text} />)
      }
      `;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasJavaScriptOrTypeScriptCode(issueBody)).toBe(true);
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
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasJavaScriptOrTypeScriptCode(issueBody)).toBe(true);
    });

    it('should return false when snippet has no JS/TS code', () => {
      const issueBody = `
      \`\`\`
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
      dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      \`\`\`
      `;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasJavaScriptOrTypeScriptCode(issueBody)).toBe(false);
    });

    it('should return false when snippet is empty', () => {
      const issueBody = ``;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasJavaScriptOrTypeScriptCode(issueBody)).toBe(false);
    });

    it('should return false when snippet is null', () => {
      const issueBody = null;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasJavaScriptOrTypeScriptCode(issueBody)).toBe(false);
    });

    it('should return false when snippet is undefined', () => {
      const issueBody = undefined;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator._hasJavaScriptOrTypeScriptCode(issueBody)).toBe(false);
    });
  });

  describe('isReproValid', () => {
    it('should return false when issue body is empty', () => {
      const issueBody = ``;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator.isReproValid(issueBody)).toBe(false);
    });

    it('should return false when issue body is null', () => {
      const issueBody = null;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator.isReproValid(issueBody)).toBe(false);
    });

    it('should return false when issue body is undefined', () => {
      const issueBody = undefined;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator.isReproValid(issueBody)).toBe(false);
    });

    it('should return false when repro section is empty', () => {
      const issueBody = `## Reproduction`;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator.isReproValid(issueBody)).toBe(false);
    });

    it('should return false when repro section has no repro', () => {
      const issueBody = `
      ## Reproduction

      I'll never provide a repro for you (┛ಠ_ಠ)┛彡┻━┻
      `;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator.isReproValid(issueBody)).toBe(false);
    });

    it('should return true when snack provided', () => {
      const issueBody = `
        ## Reproduction
        https://snack.expo.dev/@kacperkapusciak/example
      `;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator.isReproValid(issueBody)).toBe(true);
    });

    it('should return true when repo provided', () => {
      const issueBody = `
      ## Reproduction
      https://github.com/kacperkapusciak/my-amazing-repro
    `;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator.isReproValid(issueBody)).toBe(true);
    });

    it('should return true when both repo and snack provided', () => {
      const issueBody = `
      ## Reproduction
      https://snack.expo.dev/@kacperkapusciak/example
      https://github.com/kacperkapusciak/my-amazing-repro
    `;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator.isReproValid(issueBody)).toBe(true);
    });

    it('should return true when snack provided even when section title is removed', () => {
      const issueBody = `
        https://snack.expo.dev/@kacperkapusciak/example
      `;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator.isReproValid(issueBody)).toBe(true);
    });

    it('should return true for real reproduction from react-native-screens', () => {
      const issueBody = `
      ## Reproduction

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
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator.isReproValid(issueBody)).toBe(true);
    });

    it('should return false for real issue without reproduction from react-native-gesture-handler', () => {
      const issueBody = `
      ## Description

      I am using a PanGestureHandler in my React Native app. This works perfectly on iOS. When I run on Android, I get nothing at all, no triggers. I have installed as per the guidelines and have made the change to MainActivity.java to add the ReactActivityDelegate. I am using React Navigation. I have also attempted to use the gestureHandlerRootHOC method without any luck. Is PanGestureHandler compatible with React Navigation?

      ### Expected behavior
      Pan gesture should trigger and work as per iOS

      ### Actual behavior
      No trigger at all on Android

      <!--
      Please provide a Snack ([https://snack.expo.io/](https://snack.expo.io/)) or provide a minimal code example that reproduces the problem.
      Please provide code that can be copied and ran (with imports, please don't use pseudocode if possible).
      Here are some tips for providing a minimal example: [https://stackoverflow.com/help/mcve](https://stackoverflow.com/help/mcve).
      -->

      ## Package versions

      - React: 17.0.2
      - React Native: 0.64.1
      - React Native Gesture Handler: 1.10.3
      - React Reanimated: 2.2.0
      - React Navigation/bottom-tabs: 5.11.11
      - React Navigation/native: 5.9.4
      - React Navigation/stack": 5.14.5
      `;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator.isReproValid(issueBody)).toBe(false);
    });

    it('should return true for real comment with repro from react-native-gesture-handler', () => {
      const issueBody = `
      Here is the snippet for the gesture handler,

      \`\`\`
      const translation = {
              x: useSharedValue(0),
      };

      const SWIPE_VELOCITY = 500;
      const { width: screenWidth } = useWindowDimensions();
      const hiddenTranslateX = 2 * screenWidth;

      const gestureHandler = useAnimatedGestureHandler({
              onStart: (_, ctx) => {
                  ctx.startX = translation.x.value;
              },
              onActive: (event, ctx) => {
                  if (flipped) {
                      translation.x.value = ctx.startX + event.translationX;
                  }
              },
              onEnd: (event) => {
                  if (flipped) {
                      if (Math.abs(event.velocityX) < SWIPE_VELOCITY) {
                          translation.x.value = withSpring(0);

                          return;
                      }
                      
                      //perform actions with swipe
                      translation.x.value = withSpring(Math.sign(event.velocityX * 10000) * hiddenTranslateX);
                  }
              },
          });


      return (
          <PanGestureHandler onGestureEvent={gestureHandler}>
              <Cards/>
        </PanGestureHandler>
      )
      \`\`\`
      `;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator.isReproValid(issueBody)).toBe(true);
    });

    it('should return true when real life example repo comment is provided', () => {
      const issueBody = `This is my repro for this issue: https://github.com/kacperkapusciak/react-native-repro`;
      const reproValidator = new ReproValidator('kacperkapusciak');

      expect(reproValidator.isReproValid(issueBody)).toBe(true);
    });
  });
});
