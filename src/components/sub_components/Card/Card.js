import React, { useContext } from "react";
import AuthContext from "../../../Context";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./Card.css";

const CardWrapper = ({
  image,
  Name,
  Creds,
  type,
  callBack,
  removeCallback,
}) => {
  const Main = useContext(AuthContext);
  const isAdmin = Main.userInfo.email === "admin@xamify.com";
  type = typeof type === undefined ? "all" : "course";
  callBack = typeof callBack === undefined ? () => {} : callBack;
  removeCallback =
    typeof removeCallback === undefined ? () => {} : removeCallback;
  console.log(">> CREDS -> ", Creds);
  return (
    <div className="card-wrapper">
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "80%",
        }}
      >
        <Card
          sx={{
            display: "flex",
            width: "100%",
            padding: "2%",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            cursor: "pointer",
            color: "var(--primary-color)",
          }}
        >
          {type === "course" ? (
            <CardMedia
              component="img"
              alt={`profile-pic-${Name}`}
              height="140"
              image={image}
              sx={{ width: "50%" }}
            />
          ) : null}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {Name}
            </Typography>
            {Array.isArray(Creds) && Creds.length > 0 ? (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontWeight: 400 }}
              >
                {Creds.join(" . ")}
              </Typography>
            ) : null}
          </CardContent>
        </Card>
        {isAdmin ? (
          <CardActions>
            <Button size="small" onClick={callBack}>
              edit
            </Button>
            <Button size="small" onClick={removeCallback}>
              remove
            </Button>
          </CardActions>
        ) : null}
      </Card>
    </div>
  );
};

export default CardWrapper;
