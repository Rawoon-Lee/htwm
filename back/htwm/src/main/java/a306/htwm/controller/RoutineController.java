package a306.htwm.controller;

import a306.htwm.dto.*;
import a306.htwm.service.RoutineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/routine")
@RequiredArgsConstructor
public class RoutineController {

    final private RoutineService routineService;

    @GetMapping("/exercise")
    public ResponseEntity<ArrayList<ExerciseDTO>> getExercise(){
        return ResponseEntity.ok().body(routineService.getExercise());
    }

    @PostMapping("")
    public ResponseEntity createRoutine(@RequestBody CreateRoutineDTO createRoutineDTO){
        try {
            routineService.create(createRoutineDTO);
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("")
    public ResponseEntity deleteRoutine(@RequestBody DeleteRoutineDTO deleteRoutineDTO){
        try{
            routineService.delete(deleteRoutineDTO);
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("")
    public ResponseEntity<ArrayList<RoutineDTO>> getRoutine(@RequestParam("username") String username){
        return ResponseEntity.ok().body(routineService.getRoutine(username));
    }
}
