export const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Data One",
      backgroundColor: "#f87979",
      data: [
        {
          x: "01:20",
          y: 60
        },
        {
          x: "09:45",
          y: 20
        },

        {
          x: "18:39",
          y: 50
        }
      ]
    }
  ]
};

export const options = {
  type: "line",
  scales: {
    x: {
      ticks: {
        source: "data"
      },
      time: {
        unit: "minute"
      }
    }
  }
};
