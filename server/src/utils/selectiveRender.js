const selectiveRender = (req, fullData, liteData) => {
    const source = req.headers["x-platform"]; // mobile / web
    return source === "mobile" ? liteData : fullData;
  };
  
  export default selectiveRender;
  