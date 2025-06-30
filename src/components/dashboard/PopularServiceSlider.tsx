import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { services } from "../../../utils/constants";

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "40%",
      right:-17,
      zIndex: 2,
      backgroundColor: "#fff",
      "&:hover": { backgroundColor: "#eee" },
    }}
  >
    <ArrowForwardIosIcon />
  </IconButton>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "40%",
      left: -17,
      zIndex: 2,
      backgroundColor: "#fff",
      "&:hover": { backgroundColor: "#eee" },
    }}
  >
    <ArrowBackIosIcon />
  </IconButton>
);

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2500,
  arrows: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 3 } },
    { breakpoint: 900, settings: { slidesToShow: 2 } },
    { breakpoint: 600, settings: { slidesToShow: 1 } },
  ],
};

export default function PopularServicesSlider() {
  return (


      <Slider {...sliderSettings}>
        {services.map((item, i) => (
          <Box key={i} px={1}>
            <Card
              sx={{
                borderRadius: 3,
                bgcolor: "#003322",
                color: "#fff",
                height: 250,
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardContent>
                <Box>

                <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                  {item.label}
                </Typography>
                      <Typography variant="subtitle1" mb={2}>
                  {item.name}
                </Typography>
                </Box>               
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{
                    width: "100%",
                    height: 120,
                    borderRadius: 2,
                    objectFit: "cover",
                  }}
                />
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>

  );
}
