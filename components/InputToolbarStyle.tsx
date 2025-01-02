// import { StyleSheet } from "react-native";

// export const getInputToolbarStyles = (theme: any) =>
//   StyleSheet.create({
//     inputToolbar: {
//       backgroundColor: theme.background,
//       paddingTop: 6,
//     },
//     primary: {
//       alignItems: "center",
//     },
//     actionsContainer: {
//       width: 44,
//       height: 44,
//       alignItems: "center",
//       justifyContent: "center",
//       marginLeft: 4,
//       marginRight: 4,
//       marginBottom: 0,
//     },
//     composer: {
//       color: theme.text,
//       backgroundColor: theme.inputBackground,
//       borderWidth: 1,
//       borderRadius: 5,
//       borderColor: theme.border,
//       paddingTop: 8.5,
//       paddingHorizontal: 12,
//       marginLeft: 0,
//     },
//     sendContainer: {
//       width: 44,
//       height: 44,
//       alignItems: "center",
//       justifyContent: "center",
//       marginHorizontal: 4,
//     },
//   });

export const getInputToolbarStyles = (theme) => ({
  inputToolbar: {
    backgroundColor: theme.background,
    padding: 6,
  },
  primary: {
    alignItems: "center",
  },
  actionsContainer: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
  },
  composer: {
    color: theme.text,
    backgroundColor: theme.composerBackground,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.borderColor,
    padding: 8,
    marginLeft: 0,
  },
  sendContainer: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
});
