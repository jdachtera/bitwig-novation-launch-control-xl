# Novation LaunchControl XL Controller Script for Bitwig

This is a controller script for Bitwig Studio for the Novation LaunchControl XL. It supports all of the 
features of the original Ableton Live Script plus some additional.

## Installation
- Download and extract the ZIP archive.
- Keep the folder structure as-is.
- Put that folder into this location on your system:
  - Mac & Linux: ~/Documents/Bitwig Studio/Controller Scripts/
  - Windows: {{your-user-name}}\Documents\Bitwig Studio\ControllerScripts\

## Navigation

The Arrow buttons can be used to navigate through the application.

## Encoder Modes
### 1. Sends/Panning

This is the default mode. The first two encoders of each channel control the first two sends. The third encoder controls 
the panning.

### 2. Sends/Device

By tapping the device button the panning encoder row changes to control the first eight parameters of the cursor device 
(The selected device of the current track).
Hold the device button and press the left or right arrow buttons to navigate through the device chain. Choose a 
different page/bank of device parameters by holding the device button and pressing one of the eight buttons at the 
bottom of the controller (e.g. bank 4 for polysynth's filter section).

### 3. Macros

This additional mode allows to control the first three macros of each track's primary device at the same time. Enter 
this mode by holding the device button and then pressing the up button. Now the three encoders of each channel control 
the macro parameters.

## Track buttons

The first row of buttons is used select the currently focused channel. The color of the button indicates the playing 
status of the tracks clip in the current scene. by holding the button a clip action is performed. This depends on the 
selected mode.

<table>
    <tr>
        <th>Mode (Button row 2 press)</th>
        <th>Action (Button row 1 hold)</th>
    </tr>
    
    <tr>
        <td>Mute</td>
        <td>Stop current clip</td>
    </tr>
    
    <tr>
        <td>Solo</td>
        <td>Launch current clip</td>
    </tr>
    
    <tr>
        <td>Record Arm</td>
        <td>Start recording the current clip slot</td>
    </tr>
           
</table>    

The mode is selected by pressing the corresponding buttons on the right.

## Transport

A few transport functions are implemented by holding the mode selector buttons:

<table>
    <tr>
        <th>Mode Button</th>
        <th>Action (Hold)</th>
    </tr>
    
    <tr>
        <td>Mute</td>
        <td>Play/Pause</td>
    </tr>
    
    <tr>
        <td>Solo</td>
        <td>Record</td>
    </tr>
    
    <tr>
        <td>Record Arm</td>
        <td>Toggle clip launcher overdub</td>
    </tr>
           
</table> 
