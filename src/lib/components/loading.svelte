<script lang="ts">
    import { loading } from '$lib/helpers/loading';
    export let percentage = 0;
</script>

{#if $loading}
<div class="lds-roller">
  <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
  </div>
<div class="percentage">{percentage}%</div>
<div class="loading-text">Loading... Thanks for your patience.</div>
{/if}

<style>
  .percentage {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 25px; /* Adjust as needed */
    color: #fff; /* Adjust as needed */
}

  .lds-roller {
  display: inline-block;
  position: fixed; /* Changed to fixed to position relative to the viewport */
  top: 50%; /* Center vertically */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, -50%); /* Offset the spinner to the center */
  width: 160px; /* Increased size */
  height: 160px; /* Increased size */
}

.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 80px 80px; /* Adjusted for the new size */
}

.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 14px; /* Increased size */
  height: 14px; /* Increased size */
  border-radius: 50%;
  background: #fff;
  margin: -7px 0 0 -7px; /* Adjusted for the new size */
}

/* You will need to adjust the positions in each of these nth-child selectors */
.lds-roller div:nth-child(1):after { top: 126px; left: 126px; }
.lds-roller div:nth-child(2):after { top: 136px; left: 112px; }
.lds-roller div:nth-child(3):after { top: 142px; left: 96px; }
.lds-roller div:nth-child(4):after { top: 144px; left: 80px; }
.lds-roller div:nth-child(5):after { top: 142px; left: 64px; }
.lds-roller div:nth-child(6):after { top: 136px; left: 48px; }
.lds-roller div:nth-child(7):after { top: 126px; left: 34px; }
.lds-roller div:nth-child(8):after { top: 112px; left: 24px; }

/* The keyframes for the animation do not need to change */
@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  position: fixed;
  top: calc(50% + 100px); /* Position below the spinner */
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px; /* Adjust as needed */
  color: #fff; /* Adjust color as needed */
  animation: flashingText 1.5s ease-in-out infinite;
}

@keyframes flashingText {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>