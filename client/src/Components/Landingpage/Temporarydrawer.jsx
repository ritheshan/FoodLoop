import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Create a theme instance with your custom font
const theme = createTheme({
  typography: {
    fontFamily: "'Merriweather', serif",
  },
});

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleNavigation = (path) => {
    if (path.startsWith("#")) {
      const element = document.getElementById(path.substring(1));
      if (element) {
        setTimeout(() => {
          window.scrollTo({
            top: element.offsetTop,
            behavior: "smooth",
          });
        }, 300);
      }
    } else {
      navigate(path);
    }
  
    setOpen(false);
  };
  
  const DrawerList = (
    <Box
      className="w-64 backdrop-blur-sm bg-colour3 h-full p-4 shadow-xl transform transition-transform duration-300"
      role="presentation"
      onClick={toggleDrawer(false)}
      sx={{ fontFamily: "'Merriweather', serif" }}
    >
      <List>
        {[
          { text: "About", path: "#about" },
          { text: "Contact Us", path: "/contact" },
          { text: "Features", path: "#hallmark" },
          { text: "Testimonials", path: "#testimonials" },
          { text: "FAQs", path: "#faqs" },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              className="text-lg hover:bg-gray-500 hover:text-black transition-all duration-300 px-4 py-2 rounded-lg"
              sx={{ 
                color: "#6A9C89", // Your colour4
                "&:hover": {
                  backgroundColor: "#3B82F6", // Tailwind's blue-500
                  color: "#000000",
                }
              }}
            >
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: "bold",
                  fontFamily: "'Merriweather', serif",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Button
          onClick={toggleDrawer(true)}
          className="h-auto px-4 py-2 mx-2 my-2 text-sm sm:text-base md:text-lg lg:text-xl rounded-md shadow-md transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 text-black"
          >
            <path
              fillRule="evenodd"
              d="M3 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 5.25Zm0 4.5A.75.75 0 0 1 3.75 9h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9.75Zm0 4.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Zm0 4.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
      </div>
    </ThemeProvider>
  );
}